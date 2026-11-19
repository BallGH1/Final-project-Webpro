// ฟอร์มเพิ่ม/แก้ไขเมนู (controlled form) — ใช้ key จากหน้าแม่เพื่อรีเซ็ตเมื่อเปลี่ยนรายการที่แก้ไข
import { useState } from 'react'
import Button from '../common/Button'
import { EMPTY_MENU_ITEM, validateMenuForm } from '../../../models/menuModel'

export default function MenuForm({ categories, initialValue, saving, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    initialValue
      ? { ...initialValue, price: String(initialValue.price) }
      : { ...EMPTY_MENU_ITEM, categoryId: categories[0]?.id ?? '' },
  )
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const message = validateMenuForm(form)
    if (message) return setError(message)
    setError('')
    try {
      await onSubmit({ ...form, name: form.name.trim(), price: Number(form.price) })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="menu-name">ชื่อเมนู</label>
        <input id="menu-name" name="name" value={form.name} onChange={handleChange} maxLength={60} />
      </div>
      <div>
        <label htmlFor="menu-price">ราคา (บาท)</label>
        <input id="menu-price" name="price" type="number" min="0" value={form.price} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="menu-category">หมวดหมู่</label>
        <select id="menu-category" name="categoryId" value={form.categoryId} onChange={handleChange}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="menu-image">ไอคอน (emoji)</label>
        <input id="menu-image" name="image" value={form.image} onChange={handleChange} maxLength={8} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="menu-description">รายละเอียด</label>
        <textarea id="menu-description" name="description" rows={2} value={form.description} onChange={handleChange} maxLength={200} />
      </div>
      <label className="flex items-center gap-2 sm:col-span-2">
        <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
        เปิดขาย
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600 sm:col-span-2">
          {error}
        </p>
      )}

      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          ยกเลิก
        </Button>
      </div>
    </form>
  )
}
