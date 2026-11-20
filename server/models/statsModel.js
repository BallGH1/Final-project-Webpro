// Model: สถิติร้าน + ประวัติบิล (คำนวณจากออร์เดอร์และบิลใน db.json)
// ทุกช่วงเวลาคิดตามเวลาไทย (UTC+7) เพราะร้านอยู่ไทย ไม่ขึ้นกับเวลาของเครื่อง server
import { getAll } from './db.js'
import { HttpError } from '../utils/HttpError.js'
import { summarize } from './sessionModel.js'
import { ORDER_STATUS } from '../../shared/orderStatus.js'
import { SESSION_STATUS } from '../../shared/sessionStatus.js'

const TZ_OFFSET_MS = 7 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

export const RANGES = { today: 1, '7d': 7, '30d': 30 }

/** เที่ยงคืนวันนี้ (เวลาไทย) เป็น timestamp */
function startOfTodayTH(now = Date.now()) {
  return Math.floor((now + TZ_OFFSET_MS) / DAY_MS) * DAY_MS - TZ_OFFSET_MS
}

/** ช่วงเวลาปัจจุบัน + ช่วงก่อนหน้าที่ยาวเท่ากัน (ไว้เทียบ "เพิ่มขึ้น/ลดลง %") */
function rangeBounds(range) {
  const days = RANGES[range]
  if (!days) throw new HttpError(400, 'ช่วงเวลาไม่ถูกต้อง (today, 7d, 30d)')
  const end = startOfTodayTH() + DAY_MS
  const start = end - days * DAY_MS
  return { days, start, end, prevStart: start - days * DAY_MS, prevEnd: start }
}

const inRange = (iso, from, to) => {
  const t = new Date(iso).getTime()
  return t >= from && t < to
}

const hourTH = (iso) => new Date(new Date(iso).getTime() + TZ_OFFSET_MS).getUTCHours()
const dayKeyTH = (ts) => new Date(ts + TZ_OFFSET_MS).toISOString().slice(0, 10)

/** ตัวเลขหลักของช่วงเวลาหนึ่ง (ใช้ทั้งช่วงนี้และช่วงก่อนหน้า) */
function summarizePeriod(orders, sessions, from, to) {
  const periodOrders = orders.filter((o) => inRange(o.createdAt, from, to))
  const sold = periodOrders.filter((o) => o.status !== ORDER_STATUS.CANCELLED)
  const served = periodOrders.filter((o) => o.status === ORDER_STATUS.SERVED)
  const paidBills = sessions.filter((s) => s.status === SESSION_STATUS.CLOSED && inRange(s.closedAt, from, to))

  const revenue = sold.reduce((sum, o) => sum + o.total, 0)
  const paid = paidBills.reduce((sum, s) => sum + (s.total ?? 0), 0)
  // เวลาที่เปลี่ยนเป็น "เสิร์ฟแล้ว" = updatedAt ของออร์เดอร์ที่เสิร์ฟแล้ว
  const serveMinutes = served.map((o) => (new Date(o.updatedAt) - new Date(o.createdAt)) / 60000)

  return {
    revenue,
    paid,
    bills: paidBills.length,
    avgPerBill: paidBills.length ? paid / paidBills.length : 0,
    orders: periodOrders.length,
    cancelled: periodOrders.length - sold.length,
    cancelRate: periodOrders.length ? (periodOrders.length - sold.length) / periodOrders.length : 0,
    avgServeMinutes: serveMinutes.length ? serveMinutes.reduce((a, b) => a + b, 0) / serveMinutes.length : null,
    sold,
  }
}

export async function getStats(range = 'today') {
  const { days, start, end, prevStart, prevEnd } = rangeBounds(range)
  const [orders, sessions, menu, categories] = await Promise.all([
    getAll('orders'),
    getAll('sessions'),
    getAll('menu'),
    getAll('categories'),
  ])

  const current = summarizePeriod(orders, sessions, start, end)
  const previous = summarizePeriod(orders, sessions, prevStart, prevEnd)

  // ยอดขายตามเวลา: วันนี้ = รายชั่วโมง, 7/30 วัน = รายวัน
  let series
  if (days === 1) {
    const byHour = Array.from({ length: 24 }, (_, hour) => ({ key: String(hour), label: `${hour}:00`, value: 0 }))
    for (const o of current.sold) byHour[hourTH(o.createdAt)].value += o.total
    // แสดงเฉพาะช่วงเวลาเปิดร้าน (10:00–23:00) ขยายออกถ้ามีออร์เดอร์นอกช่วง
    const active = byHour.filter((b) => b.value > 0).map((b) => Number(b.key))
    const from = Math.min(10, ...active)
    const to = Math.max(22, ...active)
    series = byHour.slice(from, to + 1)
  } else {
    series = Array.from({ length: days }, (_, i) => {
      const ts = start + i * DAY_MS
      const key = dayKeyTH(ts)
      return { key, label: key.slice(8, 10) + '/' + key.slice(5, 7), value: 0 }
    })
    const index = Object.fromEntries(series.map((b, i) => [b.key, i]))
    for (const o of current.sold) {
      const i = index[dayKeyTH(new Date(o.createdAt).getTime())]
      if (i !== undefined) series[i].value += o.total
    }
  }

  // เมนูขายดี + ยอดตามหมวด (ใช้ชื่อ/ราคาที่บันทึกในออร์เดอร์ ลบเมนูไปแล้วยอดก็ไม่หาย)
  const menuStats = new Map()
  const categoryOf = Object.fromEntries(menu.map((m) => [m.id, m.categoryId]))
  const categoryTotals = new Map(categories.map((c) => [c.id, { id: c.id, name: c.name, value: 0 }]))
  for (const o of current.sold) {
    for (const line of o.items) {
      const amount = line.price * line.qty
      const stat = menuStats.get(line.menuId) ?? { menuId: line.menuId, name: line.name, image: line.image, qty: 0, revenue: 0 }
      stat.qty += line.qty
      stat.revenue += amount
      menuStats.set(line.menuId, stat)
      const cat = categoryTotals.get(categoryOf[line.menuId])
      if (cat) cat.value += amount
    }
  }
  const topMenus = [...menuStats.values()].sort((a, b) => b.qty - a.qty || b.revenue - a.revenue).slice(0, 5)

  // ตอนนี้ในร้าน (ไม่ขึ้นกับช่วงเวลา)
  const activeSessions = sessions.filter((s) => s.status !== SESSION_STATUS.CLOSED)
  const live = {
    occupied: activeSessions.length,
    billing: activeSessions.filter((s) => s.status === SESSION_STATUS.BILLING).length,
    calling: activeSessions.filter((s) => s.staffCall).length,
    pendingOrders: orders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
    preparingOrders: orders.filter((o) => o.status === ORDER_STATUS.PREPARING).length,
  }

  const kpi = ({ sold: _sold, ...rest }) => rest
  return {
    range,
    from: new Date(start).toISOString(),
    to: new Date(end).toISOString(),
    current: kpi(current),
    previous: kpi(previous),
    series,
    seriesUnit: days === 1 ? 'hour' : 'day',
    topMenus,
    categories: [...categoryTotals.values()].sort((a, b) => b.value - a.value),
    live,
  }
}

/** ประวัติบิลที่ปิดแล้ว (ใหม่สุดก่อน) กรองตามช่วงเวลาและโต๊ะได้ */
export async function findClosedBills({ range = '7d', tableId } = {}) {
  const { start, end } = rangeBounds(range)
  const [sessions, orders] = await Promise.all([getAll('sessions'), getAll('orders')])
  return sessions
    .filter(
      (s) =>
        s.status === SESSION_STATUS.CLOSED &&
        inRange(s.closedAt, start, end) &&
        (!tableId || s.tableId === String(tableId).toUpperCase()),
    )
    .sort((a, b) => b.closedAt.localeCompare(a.closedAt))
    .map((s) => {
      const { token: _token, ...bill } = summarize(s, orders)
      return bill
    })
}
