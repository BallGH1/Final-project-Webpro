// Model: เมนูอาหารและหมวดหมู่ (ข้อมูล + กฎตรวจสอบความถูกต้อง)
import { getAll, nextId, update } from './db.js'
import { HttpError } from '../utils/HttpError.js'

function validate(input, categories) {
  const name = String(input.name ?? '').trim()
  const price = Number(input.price)
  const categoryId = String(input.categoryId ?? '')

  if (name.length < 2 || name.length > 60) {
    throw new HttpError(400, 'ชื่อเมนูต้องยาว 2-60 ตัวอักษร')
  }
  if (!Number.isFinite(price) || price < 0 || price > 10000) {
    throw new HttpError(400, 'ราคาต้องเป็นตัวเลขระหว่าง 0-10,000 บาท')
  }
  if (!categories.some((c) => c.id === categoryId)) {
    throw new HttpError(400, 'หมวดหมู่ไม่ถูกต้อง')
  }

  return {
    name,
    categoryId,
    price,
    image: String(input.image ?? '').trim().slice(0, 8) || '🍲',
    description: String(input.description ?? '').trim().slice(0, 200),
    available: input.available !== false,
  }
}

export function findCategories() {
  return getAll('categories')
}

export async function findAll({ categoryId, q } = {}) {
  const keyword = String(q ?? '').trim().toLowerCase()
  const menu = await getAll('menu')
  return menu.filter(
    (item) =>
      (!categoryId || item.categoryId === categoryId) &&
      (!keyword || item.name.toLowerCase().includes(keyword)),
  )
}

export async function findById(id) {
  const menu = await getAll('menu')
  const item = menu.find((m) => m.id === Number(id))
  if (!item) throw new HttpError(404, 'ไม่พบเมนูนี้')
  return item
}

export function create(input) {
  return update((db) => {
    const item = { id: nextId(db.menu), ...validate(input, db.categories) }
    db.menu.push(item)
    return item
  })
}

export function updateById(id, input) {
  return update((db) => {
    const index = db.menu.findIndex((m) => m.id === Number(id))
    if (index === -1) throw new HttpError(404, 'ไม่พบเมนูนี้')
    // รวมค่าเดิมกับค่าใหม่ก่อนตรวจสอบ จึงส่งมาแค่บางฟิลด์ได้ (เช่น { available: false })
    const item = { id: db.menu[index].id, ...validate({ ...db.menu[index], ...input }, db.categories) }
    db.menu[index] = item
    return item
  })
}

export function remove(id) {
  return update((db) => {
    const index = db.menu.findIndex((m) => m.id === Number(id))
    if (index === -1) throw new HttpError(404, 'ไม่พบเมนูนี้')
    const [removed] = db.menu.splice(index, 1)
    return removed
  })
}
