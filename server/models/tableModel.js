// Model: โต๊ะในร้าน
import { getAll } from './db.js'
import { HttpError } from '../utils/HttpError.js'

export function findAll() {
  return getAll('tables')
}

export async function findById(id) {
  const tables = await getAll('tables')
  const table = tables.find((t) => t.id === String(id).toUpperCase())
  if (!table) throw new HttpError(404, `ไม่พบโต๊ะ ${id}`)
  return table
}
