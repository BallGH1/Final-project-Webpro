// Model: ออร์เดอร์ — ราคาและยอดรวมคำนวณที่ Server จากข้อมูลเมนูจริง ไม่เชื่อค่าที่ Client ส่งมา
import { getAll, nextId, update } from './db.js'
import { HttpError } from '../utils/HttpError.js'
import { requireOrderable } from './sessionModel.js'
import {
  MAX_REASON_LENGTH,
  ORDER_STATUS,
  STATUS_LABEL,
  canChangeStatus,
  isValidStatus,
} from '../../shared/orderStatus.js'

const MAX_QTY = 20

export async function findAll({ tableId, status } = {}) {
  const orders = await getAll('orders')
  return orders
    .filter(
      (o) =>
        (!tableId || o.tableId === String(tableId).toUpperCase()) &&
        (!status || o.status === status),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function findById(id) {
  const orders = await getAll('orders')
  const order = orders.find((o) => o.id === Number(id))
  if (!order) throw new HttpError(404, 'ไม่พบออร์เดอร์นี้')
  return order
}

/** สร้างออร์เดอร์ผ่าน token ของบิล (ไม่รับเลขโต๊ะตรง ๆ เพื่อกันการสั่งเข้าโต๊ะคนอื่น) */
export function create({ token, items, note } = {}) {
  return update((db) => {
    const session = requireOrderable(db.sessions, token)
    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpError(400, 'ไม่มีรายการอาหารในออร์เดอร์')
    }

    const lines = items.map((line) => {
      const menu = db.menu.find((m) => m.id === Number(line?.menuId))
      if (!menu) throw new HttpError(400, 'มีเมนูที่ไม่มีอยู่ในระบบ')
      if (!menu.available) throw new HttpError(400, `${menu.name} หมดชั่วคราว`)
      const qty = Number(line.qty)
      if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
        throw new HttpError(400, `จำนวนของ ${menu.name} ต้องอยู่ระหว่าง 1-${MAX_QTY}`)
      }
      return { menuId: menu.id, name: menu.name, image: menu.image, price: menu.price, qty }
    })

    const id = nextId(db.orders)
    const now = new Date().toISOString()
    const order = {
      id,
      orderNo: `ORD-${String(id).padStart(4, '0')}`,
      tableId: session.tableId,
      sessionId: session.id,
      items: lines,
      total: lines.reduce((sum, l) => sum + l.price * l.qty, 0),
      note: String(note ?? '').trim().slice(0, 200),
      status: ORDER_STATUS.PENDING,
      createdAt: now,
      updatedAt: now,
    }
    db.orders.push(order)
    return order
  })
}

/** เปลี่ยนสถานะ — ถ้ายกเลิกต้องมีเหตุผล (ลูกค้าจะเห็นเหตุผลนี้ใน popup แจ้งเตือน) */
export function updateStatus(id, status, reason) {
  return update((db) => {
    const order = db.orders.find((o) => o.id === Number(id))
    if (!order) throw new HttpError(404, 'ไม่พบออร์เดอร์นี้')
    if (!isValidStatus(status)) throw new HttpError(400, 'สถานะไม่ถูกต้อง')
    if (!canChangeStatus(order.status, status)) {
      throw new HttpError(
        409,
        `เปลี่ยนสถานะจาก "${STATUS_LABEL[order.status]}" เป็น "${STATUS_LABEL[status]}" ไม่ได้`,
      )
    }
    if (status === ORDER_STATUS.CANCELLED) {
      const text = String(reason ?? '').trim()
      if (text.length === 0) throw new HttpError(400, 'กรุณาระบุเหตุผลที่ยกเลิก')
      if (text.length > MAX_REASON_LENGTH) {
        throw new HttpError(400, `เหตุผลยาวได้ไม่เกิน ${MAX_REASON_LENGTH} ตัวอักษร`)
      }
      order.cancelReason = text
    }
    order.status = status
    order.updatedAt = new Date().toISOString()
    return order
  })
}
