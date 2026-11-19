// ฟอร์มเพิ่ม/แก้ไขเมนู (controlled form) — ใช้ key จากหน้าแม่เพื่อรีเซ็ตเมื่อเปลี่ยนรายการที่แก้ไข
import { useState } from 'react'
import { CircleAlert } from 'lucide-react'
import Button from '../common/Button'
import { ICON_OPTIONS, TONES } from '../common/foodIcons'
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

  // ไอคอนยังบันทึกเป็น emoji ตามรูปแบบข้อมูลเดิม แต่ให้พนักงานเลือกจากรูปไอคอน
  const selectIcon = (key) => setForm((current) => ({ ...current, image: key }))

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
    <form onSubmit={handleSubmit} noValidate className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
      <fieldset className="fieldset">
        <label htmlFor="menu-name" className="fieldset-legend">
          ชื่อเมนู
        </label>
        <input id="menu-name" name="name" value={form.name} onChange={handleChange} maxLength={60} className="input w-full" placeholder="เช่น หมูนุ่มพริกไทยดำ" />
      </fieldset>
      <fieldset className="fieldset">
        <label htmlFor="menu-price" className="fieldset-legend">
          ราคา (บาท)
        </label>
        <input id="menu-price" name="price" type="number" min="0" value={form.price} onChange={handleChange} className="input w-full" placeholder="0" />
      </fieldset>
      <fieldset className="fieldset sm:col-span-2">
        <label htmlFor="menu-category" className="fieldset-legend">
          หมวดหมู่
        </label>
        <select id="menu-category" name="categoryId" value={form.categoryId} onChange={handleChange} className="select w-full">
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset className="fieldset sm:col-span-2">
        <legend className="fieldset-legend">ไอคอน</legend>
        <p className="label -mt-1 mb-1 whitespace-normal">ใช้แสดงแทนรูปอาหาร เมื่อเมนูนี้ยังไม่มีรูป</p>
        <div role="radiogroup" aria-label="เลือกไอคอนเมนู" className="grid grid-cols-5 gap-2 sm:grid-cols-7">
          {ICON_OPTIONS.map(({ key, Icon, label, tone }) => {
            const selected = form.image === key
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={label}
                title={label}
                onClick={() => selectIcon(key)}
                className={`flex flex-col items-center gap-1 rounded-field border p-2 text-[10px] transition ${
                  selected ? 'border-primary ring-2 ring-primary/30' : 'border-base-300 hover:border-base-content/30'
                }`}
              >
                <span className={`flex size-8 items-center justify-center rounded-lg ${TONES[tone]}`}>
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="truncate opacity-70">{label}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="fieldset sm:col-span-2">
        <label htmlFor="menu-description" className="fieldset-legend">
          รายละเอียด
        </label>
        <textarea id="menu-description" name="description" rows={2} value={form.description} onChange={handleChange} maxLength={200} className="textarea w-full" />
      </fieldset>
      <label className="label mt-2 cursor-pointer gap-3 text-base-content sm:col-span-2">
        <input type="checkbox" name="available" checked={form.available} onChange={handleChange} className="toggle toggle-success" />
        เปิดขาย
      </label>

      {error && (
        <div role="alert" className="alert alert-error alert-soft mt-3 py-2 sm:col-span-2">
          <CircleAlert size={16} aria-hidden="true" />
          {error}
        </div>
      )}

      <div className="modal-action sm:col-span-2">
        <Button variant="ghost" onClick={onCancel}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <span className="loading loading-spinner loading-sm" />}
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </Button>
      </div>
    </form>
  )
}
