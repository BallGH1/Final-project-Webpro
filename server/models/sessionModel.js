// Model: บิล (รอบการนั่งของโต๊ะ)
// - เปิดโต๊ะแล้วได้ token สุ่มสำหรับใส่ใน QR ลูกค้าต้องมี token จึงจะสั่งอาหารเข้าโต๊ะนั้นได้
// - ปิดโต๊ะแล้ว token ใช้ไม่ได้อีก ลูกค้ารอบถัดไปจึงไม่เห็นออร์เดอร์ของรอบก่อน
import { randomBytes } from 'node:crypto'
import { getAll, nextId, update } from './db.js'
import { HttpError } from '../utils/HttpError.js'
import { ORDER_STATUS } from '../../shared/orderStatus.js'
import { SESSION_STATUS, canOrder, isActiveSession } from '../../shared/sessionStatus.js'

// token สุ่มจาก crypto (เดาไม่ได้ ต่างจาก Math.random) ยาว 8 ตัวอักษร
function createToken(sessions) {
  let token
  do {
    token = randomBytes(6).toString('base64url')
  } while (sessions.some((s) => s.token === token))
  return token
}

/**
 * สรุปบิล: รวมทุกออร์เดอร์ของรอบนี้ (ไม่นับที่ยกเลิก) และรวมเมนูเดียวกันเป็นบรรทัดเดียว
 * @returns บิลพร้อม lines, total, orderCount และ unfinished (ออร์เดอร์ที่ยังไม่เสิร์ฟ)
 */
export function summarize(session, orders) {
  const own = orders.filter((o) => o.sessionId === session.id)
  const billable = own.filter((o) => o.status !== ORDER_STATUS.CANCELLED)

  const lines = []
  for (const order of billable) {
    for (const item of order.items) {
      const found = lines.find((l) => l.menuId === item.menuId && l.price === item.price)
      if (found) found.qty += item.qty
      else lines.push({ menuId: item.menuId, name: item.name, image: item.image, price: item.price, qty: item.qty })
    }
  }

  return {
    ...session,
    lines,
    total: lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    orderCount: billable.length,
    unfinished: own.filter(
      (o) => o.status === ORDER_STATUS.PENDING || o.status === ORDER_STATUS.PREPARING,
    ).length,
  }
}

/** บิลที่ยังเปิดอยู่ของโต๊ะ (ไม่มีคืน undefined) */
export function findActive(sessions, tableId) {
  return sessions.find((s) => s.tableId === tableId && isActiveSession(s.status))
}

function requireByToken(sessions, token) {
  const session = sessions.find((s) => s.token === String(token ?? ''))
  if (!session) throw new HttpError(404, 'ไม่พบบิลนี้ QR Code อาจไม่ถูกต้อง')
  return session
}

/** ใช้ตอนสร้างออร์เดอร์: ตรวจว่า token นี้ยังสั่งอาหารได้ */
export function requireOrderable(sessions, token) {
  const session = requireByToken(sessions, token)
  if (session.status === SESSION_STATUS.CLOSED) {
    throw new HttpError(410, 'บิลนี้ปิดแล้ว QR Code นี้ใช้สั่งอาหารไม่ได้อีก')
  }
  if (!canOrder(session.status)) {
    throw new HttpError(409, 'ขอเช็กบิลแล้ว สั่งอาหารเพิ่มไม่ได้')
  }
  return session
}

export function open(tableId) {
  return update((db) => {
    const table = db.tables.find((t) => t.id === String(tableId ?? '').toUpperCase())
    if (!table) throw new HttpError(404, `ไม่พบโต๊ะ ${tableId}`)
    if (findActive(db.sessions, table.id)) {
      throw new HttpError(409, `โต๊ะ ${table.id} เปิดอยู่แล้ว ต้องปิดบิลเดิมก่อน`)
    }

    const id = nextId(db.sessions)
    const session = {
      id,
      billNo: `BILL-${String(id).padStart(4, '0')}`,
      tableId: table.id,
      token: createToken(db.sessions),
      status: SESSION_STATUS.OPEN,
      openedAt: new Date().toISOString(),
      billRequestedAt: null,
      closedAt: null,
    }
    db.sessions.push(session)
    return summarize(session, db.orders)
  })
}

/** ลูกค้า: ข้อมูลบิลจาก token (บิลที่ปิดแล้วยังอ่านได้ เพื่อแสดงหน้าขอบคุณ) */
export async function findByToken(token) {
  const [sessions, orders] = await Promise.all([getAll('sessions'), getAll('orders')])
  return summarize(requireByToken(sessions, token), orders)
}

/** ลูกค้า: ออร์เดอร์เฉพาะรอบนี้ */
export async function findOrdersByToken(token) {
  const [sessions, orders] = await Promise.all([getAll('sessions'), getAll('orders')])
  const session = requireByToken(sessions, token)
  if (session.status === SESSION_STATUS.CLOSED) throw new HttpError(410, 'บิลนี้ปิดแล้ว')
  return orders
    .filter((o) => o.sessionId === session.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function requestBill(token) {
  return update((db) => {
    const session = requireByToken(db.sessions, token)
    if (session.status === SESSION_STATUS.CLOSED) throw new HttpError(410, 'บิลนี้ปิดแล้ว')
    if (session.status === SESSION_STATUS.OPEN) {
      const summary = summarize(session, db.orders)
      if (summary.orderCount === 0) throw new HttpError(400, 'ยังไม่มีออร์เดอร์ในบิลนี้')
      session.status = SESSION_STATUS.BILLING
      session.billRequestedAt = new Date().toISOString()
    }
    return summarize(session, db.orders)
  })
}

/** พนักงาน: บิลรวมของรอบนี้ */
export async function findBill(id) {
  const [sessions, orders] = await Promise.all([getAll('sessions'), getAll('orders')])
  const session = sessions.find((s) => s.id === Number(id))
  if (!session) throw new HttpError(404, 'ไม่พบบิลนี้')
  return summarize(session, orders)
}

/** พนักงาน: รับชำระเงินแล้วปิดโต๊ะ */
export function close(id) {
  return update((db) => {
    const session = db.sessions.find((s) => s.id === Number(id))
    if (!session) throw new HttpError(404, 'ไม่พบบิลนี้')
    if (session.status === SESSION_STATUS.CLOSED) throw new HttpError(409, 'บิลนี้ปิดไปแล้ว')

    const summary = summarize(session, db.orders)
    if (summary.unfinished > 0) {
      throw new HttpError(409, `ยังมีออร์เดอร์ที่ยังไม่เสิร์ฟ ${summary.unfinished} รายการ ต้องเสิร์ฟหรือยกเลิกก่อนปิดโต๊ะ`)
    }

    session.status = SESSION_STATUS.CLOSED
    session.closedAt = new Date().toISOString()
    session.total = summary.total
    return summarize(session, db.orders)
  })
}
