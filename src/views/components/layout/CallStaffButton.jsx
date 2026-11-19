import { useState } from 'react'
import { BellRing, X } from 'lucide-react'
import { CALL_REASONS } from '../../../models/sessionModel'
import { formatTime } from '../../../models/formatters'
import Modal from '../common/Modal'
import { ErrorState } from '../common/StateMessages'

/**
 * ปุ่มเรียกพนักงาน (มุมขวาบนของหน้าลูกค้า) → เลือกเหตุผล → ขึ้นเป็นกล่องคำพูดบนผังร้านของพนักงาน
 * ถ้าเรียกแล้วและพนักงานยังไม่รับทราบ ปุ่มจะเปลี่ยนเป็น "เรียกแล้ว" (กดเรียกซ้ำ/เปลี่ยนเรื่องได้)
 */
export default function CallStaffButton({ staffCall, onCall }) {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(null) // เหตุผลที่กำลังส่ง
  const [error, setError] = useState('')

  async function handleCall(reason, close) {
    setSending(reason)
    setError('')
    try {
      await onCall(reason)
      close()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(null)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`btn btn-sm gap-1.5 rounded-full max-sm:min-h-11 ${
          staffCall ? 'btn-info btn-soft' : 'btn-outline border-base-300 bg-base-100'
        }`}
      >
        <BellRing size={16} aria-hidden="true" className={staffCall ? 'motion-safe:animate-pulse' : ''} />
        <span className="hidden sm:inline">{staffCall ? 'เรียกแล้ว' : 'เรียกพนักงาน'}</span>
        <span className="sr-only sm:hidden">{staffCall ? 'เรียกพนักงานแล้ว' : 'เรียกพนักงาน'}</span>
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)} locked={Boolean(sending)} labelledBy="call-staff-title" boxClassName="max-w-sm">
          {(close) => (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 id="call-staff-title" className="text-lg font-semibold">
                    เรียกพนักงาน
                  </h2>
                  <p className="text-sm text-base-content/70">
                    {staffCall
                      ? `เรียกไปแล้วเมื่อ ${formatTime(staffCall.at)} น. (${staffCall.reason}) — พนักงานกำลังมา`
                      : 'เลือกเรื่องที่ต้องการ พนักงานจะเห็นทันที'}
                  </p>
                </div>
                <button type="button" className="btn btn-ghost btn-circle max-sm:size-11" onClick={close} aria-label="ปิด">
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CALL_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    disabled={Boolean(sending)}
                    onClick={() => handleCall(reason, close)}
                    className={`btn h-auto min-h-14 whitespace-normal ${
                      reason === CALL_REASONS[0] ? 'btn-primary col-span-2' : 'btn-outline border-base-300'
                    }`}
                  >
                    {sending === reason && <span className="loading loading-spinner loading-sm" />}
                    {reason}
                  </button>
                ))}
              </div>
              {error && <ErrorState message={error} />}
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
