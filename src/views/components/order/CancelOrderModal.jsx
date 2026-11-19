import { useState } from 'react'
import { Ban, X } from 'lucide-react'
import { CANCEL_REASONS, MAX_REASON_LENGTH } from '../../../models/orderModel'
import Button from '../common/Button'
import { ErrorState } from '../common/StateMessages'

const OTHER = 'other'

/**
 * หน้าต่างเลือกเหตุผลก่อนยกเลิกออร์เดอร์ (พนักงาน) — ลูกค้าจะเห็นเหตุผลนี้ใน popup
 * `onConfirm(reason)` คืน Promise: ถ้า error จะแสดงในหน้าต่างนี้
 */
export default function CancelOrderModal({ order, onConfirm, onClose }) {
  const [choice, setChoice] = useState(CANCEL_REASONS[0])
  const [otherText, setOtherText] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const reason = choice === OTHER ? otherText.trim() : choice

  async function handleSubmit(e) {
    e.preventDefault()
    if (!reason) {
      setError('กรุณาพิมพ์เหตุผล')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onConfirm(reason)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-sm bg-base-100 shadow-xl"
      >
        <div className="card-body gap-4 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 id="cancel-title" className="card-title text-lg">
                ยกเลิก {order.orderNo}
              </h2>
              <p className="text-sm text-base-content/60">โต๊ะ {order.tableId} · ลูกค้าจะเห็นเหตุผลนี้</p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={onClose} aria-label="ปิด">
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-semibold">เหตุผลที่ยกเลิก</legend>
            {[...CANCEL_REASONS, OTHER].map((value) => (
              <label key={value} className="flex cursor-pointer items-center gap-3 rounded-field border border-base-300 px-3 py-2">
                <input
                  type="radio"
                  name="cancel-reason"
                  className="radio radio-sm radio-primary"
                  value={value}
                  checked={choice === value}
                  onChange={() => setChoice(value)}
                />
                {value === OTHER ? 'อื่นๆ (พิมพ์เอง)' : value}
              </label>
            ))}
            {choice === OTHER && (
              <input
                type="text"
                autoFocus
                maxLength={MAX_REASON_LENGTH}
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="เช่น ครัวปิดรับเมนูนี้แล้ว"
                className="input w-full"
              />
            )}
          </fieldset>

          {error && <ErrorState message={error} />}

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              ไม่ยกเลิก
            </Button>
            <Button type="submit" variant="danger" disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-sm" /> : <Ban size={16} aria-hidden="true" />}
              ยืนยันยกเลิก
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
