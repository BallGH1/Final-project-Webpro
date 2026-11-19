import { useState } from 'react'
import { HandCoins, ReceiptText, TriangleAlert, X } from 'lucide-react'
import { formatMoney } from '../../../models/formatters'
import Button from '../common/Button'
import FoodImage from '../common/FoodImage'
import Modal from '../common/Modal'
import { ErrorState } from '../common/StateMessages'

/**
 * หน้าต่างยืนยันขอเช็กบิล (ลูกค้า) — แสดงสรุปรายการและยอดรวมให้ตรวจก่อนกดยืนยัน
 * `onConfirm()` คืน Promise: ถ้า error จะแสดงในหน้าต่างนี้
 */
export default function RequestBillModal({ session, onConfirm, onClose }) {
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
    <Modal onClose={onClose} locked={saving} labelledBy="request-bill-title" boxClassName="max-w-md space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ReceiptText size={22} aria-hidden="true" />
          </span>
          <div>
            <h2 id="request-bill-title" className="text-lg font-semibold">
              ยืนยันเช็กบิล
            </h2>
            <p className="text-sm text-base-content/70">
              โต๊ะ {session.tableId} · บิล {session.billNo}
            </p>
          </div>
        </div>
        <button type="button" className="btn btn-ghost btn-circle max-sm:size-11" onClick={onClose} disabled={saving} aria-label="ปิด">
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <ul className="divide-y divide-base-300 rounded-box border border-base-300 px-3 text-sm">
        {session.lines.map((line) => (
          <li key={`${line.menuId}-${line.price}`} className="flex items-center justify-between gap-2 py-2">
            <span className="flex min-w-0 items-center gap-2">
              <FoodImage name={line.name} emoji={line.image} iconSize={14} className="size-8 rounded-lg" />
              <span className="truncate">{line.name}</span>
              <span className="shrink-0 text-base-content/70">× {line.qty}</span>
            </span>
            <span className="shrink-0">{formatMoney(line.price * line.qty)}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-baseline justify-between border-t border-dashed border-base-300 pt-3">
        <span className="font-semibold">ยอดรวมทั้งสิ้น</span>
        <span className="font-display text-3xl font-semibold text-primary">{formatMoney(session.total)}</span>
      </div>

      {session.unfinished > 0 && (
        <p className="flex items-start gap-2 rounded-field bg-info/10 px-3 py-2 text-sm text-info-strong">
          <ReceiptText size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          ยังมี {session.unfinished} ออร์เดอร์ที่ครัวกำลังทำ อาหารจะเสิร์ฟครบก่อนพนักงานเก็บเงิน
        </p>
      )}

      <p className="flex items-start gap-2 rounded-field bg-warning/15 px-3 py-2 text-sm">
        <TriangleAlert size={16} className="mt-0.5 shrink-0 text-warning-strong" aria-hidden="true" />
        หลังขอเช็กบิลแล้วจะสั่งอาหารเพิ่มไม่ได้
      </p>

      {error && <ErrorState message={error} />}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          สั่งเพิ่มก่อน
        </Button>
        <Button onClick={handleConfirm} disabled={saving}>
          {saving ? <span className="loading loading-spinner loading-sm" /> : <HandCoins size={18} aria-hidden="true" />}
          ยืนยันเช็กบิล
        </Button>
      </div>
    </Modal>
  )
}
