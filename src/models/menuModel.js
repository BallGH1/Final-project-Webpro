// Model: เมนูอาหาร (เรียก API + ฟังก์ชันจัดการข้อมูลเมนู)
import { request } from './apiClient'

export const ALL_CATEGORIES = 'all'

export const EMPTY_MENU_ITEM = {
  name: '',
  categoryId: '',
  price: '',
  image: '🍲',
  description: '',
  available: true,
}

export const getMenu = () => request('/menu')
export const getCategories = () => request('/categories')
export const createMenuItem = (item) => request('/menu', { method: 'POST', body: item })
export const updateMenuItem = (id, item) => request(`/menu/${id}`, { method: 'PUT', body: item })
export const deleteMenuItem = (id) => request(`/menu/${id}`, { method: 'DELETE' })

/** ค้นหาตามชื่อ + กรองตามหมวดหมู่ */
export function filterMenu(menu, { query = '', categoryId = ALL_CATEGORIES } = {}) {
  const keyword = query.trim().toLowerCase()
  return menu.filter(
    (item) =>
      (categoryId === ALL_CATEGORIES || item.categoryId === categoryId) &&
      item.name.toLowerCase().includes(keyword),
  )
}

/** ตรวจฟอร์มเมนูก่อนส่ง (Server ตรวจซ้ำอีกชั้น) — คืนข้อความ error หรือ '' ถ้าผ่าน */
export function validateMenuForm(form) {
  const name = form.name.trim()
  const price = Number(form.price)
  if (name.length < 2 || name.length > 60) return 'ชื่อเมนูต้องยาว 2-60 ตัวอักษร'
  if (form.price === '' || !Number.isFinite(price) || price < 0 || price > 10000) {
    return 'ราคาต้องเป็นตัวเลขระหว่าง 0-10,000 บาท'
  }
  if (!form.categoryId) return 'กรุณาเลือกหมวดหมู่'
  return ''
}
