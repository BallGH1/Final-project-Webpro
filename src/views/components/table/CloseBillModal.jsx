import { useState } from 'react'
import { HandCoins, QrCode, X } from 'lucide-react'
import { formatMoney } from '../../../models/formatters'
import Button from '../common/Button'
import { ErrorState } from '../common/StateMessages'

/**
 * หน้าต่างยืนยันรับชำระและปิดโต๊ะ (พนักงาน)
 * `onConfirm()` คืน Promise: ถ้า error จะแสดงในหน้าต่างนี้
 */
export default function CloseBillModal({ bill, onConfirm, onClose }) {
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="close-bill-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={saving ? undefined : onClose}
    >
      <div
        className="card w-full max-w-sm rounded-b-none bg-base-100 shadow-xl sm:rounded-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-body gap-4 p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-success/15 text-success">
                <HandCoins size={22} aria-hidden="true" />
              </span>
              <div>
                <h2 id="close-bill-title" className="text-lg font-semibold">
                  รับชำระและปิดโต๊ะ
                </h2>
                <p className="text-sm text-base-content/60">
                  โต๊ะ {bill.tableId} · บิล {bill.billNo}
                </p>
              </div>
            </div>
            <button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={onClose} disabled={saving} aria-label="ปิด">
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="rounded-box bg-base-200 px-4 py-5 text-center">
            <p className="text-sm text-base-content/60">
              ยอดที่ต้องรับชำระ ({bill.orderCount} ออร์เดอร์)
            </p>
            <p className="font-display text-4xl font-semibold text-primary">{formatMoney(bill.total)}</p>
          </div>

          <p className="flex items-start gap-2 rounded-field bg-warning/15 px-3 py-2 text-sm">
            <QrCode size={16} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
            หลังปิดโต๊ะแล้ว QR ของรอบนี้จะใช้ไม่ได้อีก และโต๊ะจะว่างพร้อมรับลูกค้าใหม่
          </p>

          {error && <ErrorState message={error} />}

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              ยังไม่ปิด
            </Button>
            <Button onClick={handleConfirm} disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-sm" /> : <HandCoins size={18} aria-hidden="true" />}
              รับชำระแล้ว
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
