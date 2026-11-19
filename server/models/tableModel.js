// Model: โต๊ะในร้าน (แนบบิลที่เปิดอยู่ของแต่ละโต๊ะมาด้วย เพื่อให้พนักงานเห็นสถานะโต๊ะ)
import { getAll } from './db.js'
import { HttpError } from '../utils/HttpError.js'
import { findActive, summarize } from './sessionModel.js'

async function loadAll() {
  const [tables, sessions, orders] = await Promise.all([
    getAll('tables'),
    getAll('sessions'),
    getAll('orders'),
  ])
  return tables.map((table) => {
    const session = findActive(sessions, table.id)
    return { ...table, session: session ? summarize(session, orders) : null }
  })
}

export function findAll() {
  return loadAll()
}

export async function findById(id) {
  const tables = await loadAll()
  const table = tables.find((t) => t.id === String(id).toUpperCase())
  if (!table) throw new HttpError(404, `ไม่พบโต๊ะ ${id}`)
  return table
}
