import { useState } from 'react'
import { Trash2, TriangleAlert } from 'lucide-react'
import { formatMoney } from '../../../models/formatters'
import Button from '../common/Button'
import FoodImage from '../common/FoodImage'
import Modal from '../common/Modal'
import { ErrorState } from '../common/StateMessages'

/**
 * หน้าต่างยืนยันลบเมนู
 * `onConfirm()` คืน Promise: ถ้า error จะแสดงในหน้าต่างนี้
 */
export default function DeleteMenuModal({ item, categoryName, onConfirm, onClose }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    setSaving(true)
    setError('')
    try {
      await onConfirm()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <Modal onClose={onClose} locked={saving} labelledBy="delete-menu-title" boxClassName="max-w-sm space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-error/15 text-error">
          <Trash2 size={22} aria-hidden="true" />
        </span>
        <h2 id="delete-menu-title" className="text-lg font-semibold">
          ลบเมนูนี้?
        </h2>
      </div>

      <div className="flex items-center gap-3 rounded-box border border-base-300 p-3">
        <FoodImage name={item.name} emoji={item.image} categoryId={item.categoryId} iconSize={20} className="size-14 rounded-xl" />
        <div className="min-w-0">
          <p className="truncate font-semibold">{item.name}</p>
          <p className="text-sm text-base-content/70">
            {categoryName} · {formatMoney(item.price)}
          </p>
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-field bg-warning/15 px-3 py-2 text-sm">
        <TriangleAlert size={16} className="mt-0.5 shrink-0 text-warning-strong" aria-hidden="true" />
        ลบแล้วกู้คืนไม่ได้ ลูกค้าจะไม่เห็นเมนูนี้อีก (ออร์เดอร์เก่าที่สั่งไปแล้วไม่ได้รับผลกระทบ)
        ถ้าแค่ของหมดชั่วคราว ให้ปิดการขายแทน
      </p>

      {error && <ErrorState message={error} />}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          ไม่ลบ
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={saving}>
          {saving ? <span className="loading loading-spinner loading-sm" /> : <Trash2 size={16} aria-hidden="true" />}
          ลบเมนู
        </Button>
      </div>
    </Modal>
  )
}
