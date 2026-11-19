// Controller: จัดการเมนูของพนักงาน (เพิ่ม / แก้ไข / ลบ / เปิด-ปิดการขาย)
// error จาก API จะถูกโยนต่อให้ View แสดงข้อความ
import { useState } from 'react'
import { useMenu } from './useMenu'
import { createMenuItem, deleteMenuItem, updateMenuItem } from '../models/menuModel'

export function useMenuManager() {
  const menuState = useMenu()
  const { setMenu } = menuState
  const [saving, setSaving] = useState(false)

  async function run(action) {
    setSaving(true)
    try {
      return await action()
    } finally {
      setSaving(false)
    }
  }

  const addItem = (form) =>
    run(async () => {
      const created = await createMenuItem(form)
      setMenu((list) => [...list, created])
      return created
    })

  const editItem = (id, form) =>
    run(async () => {
      const updated = await updateMenuItem(id, form)
      setMenu((list) => list.map((item) => (item.id === id ? updated : item)))
      return updated
    })

  const removeItem = (id) =>
    run(async () => {
      await deleteMenuItem(id)
      setMenu((list) => list.filter((item) => item.id !== id))
    })

  const toggleAvailable = (item) => editItem(item.id, { available: !item.available })

  return { ...menuState, saving, addItem, editItem, removeItem, toggleAvailable }
}
