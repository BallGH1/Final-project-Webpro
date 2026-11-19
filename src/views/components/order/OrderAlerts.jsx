import { useEffect, useState } from 'react'
import { Ban, CircleCheck, Flame } from 'lucide-react'
import { ORDER_STATUS } from '../../../models/orderModel'
import { formatMoney } from '../../../models/formatters'
import Button from '../common/Button'
import Modal from '../common/Modal'

const TOAST_MS = 4000
const TOAST_EXIT_MS = 220 // ช่วงท้ายลอยขึ้นจางหาย (toast-out ใน index.css)

const TOASTS = {
  preparing: { className: 'alert-info', Icon: Flame, text: 'ครัวรับออร์เดอร์แล้ว กำลังเตรียมอาหาร' },
  served: { className: 'alert-success', Icon: CircleCheck, text: 'เสิร์ฟแล้ว ขอให้อร่อยนะ' },
}

/** toast เล็กมุมจอ หายเองใน 4 วินาที */
function StatusToast({ alert, onDismiss }) {
  const style = TOASTS[alert.order.status]
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const leave = setTimeout(() => setLeaving(true), TOAST_MS - TOAST_EXIT_MS)
    const remove = setTimeout(() => onDismiss(alert.key), TOAST_MS)
    return () => {
      clearTimeout(leave)
      clearTimeout(remove)
    }
  }, [alert.key, onDismiss])

  if (!style) return null
  const { className, Icon, text } = style
  return (
    <div role="status" className={`alert ${className} py-2.5 shadow-lg ${leaving ? 'toast-leaving' : ''}`}>
      <Icon size={18} aria-hidden="true" />
      <span>
        <b>{alert.order.orderNo}</b> {text}
      </span>
    </div>
  )
}

/** popup กลางจอเมื่อออร์เดอร์ถูกยกเลิก — ต้องกด "รับทราบ" จึงจะปิด */
function CancelledPopup({ alert, onDismiss }) {
  const { order } = alert
  const dismiss = () => onDismiss(alert.key)
  return (
    <Modal role="alertdialog" onClose={dismiss} labelledBy={`cancel-${alert.key}`} boxClassName="max-w-sm">
      {(close) => (
        <>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-error/15 text-error">
              <Ban size={28} aria-hidden="true" />
            </span>
            <h2 id={`cancel-${alert.key}`} className="text-xl font-semibold">
              ออร์เดอร์ {order.orderNo} ถูกยกเลิก
            </h2>
            {order.cancelReason && (
              <p className="rounded-field bg-error/10 px-3 py-2 text-error">เหตุผล: {order.cancelReason}</p>
            )}
            <ul className="w-full text-sm text-base-content/70">
              {order.items.map((line, index) => (
                <li key={`${line.menuId}-${index}`} className="flex justify-between gap-2">
                  <span>
                    {line.name} × {line.qty}
                  </span>
                  <span>{formatMoney(line.price * line.qty)}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-base-content/70">ยอดของออร์เดอร์นี้ไม่ถูกนับในบิล สามารถสั่งเมนูอื่นแทนได้</p>
            <Button className="btn-block" onClick={close}>
              รับทราบ
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}

/** แสดงการแจ้งเตือนทั้งหมดจาก useOrderAlerts (ใช้ใน CustomerLayout จึงเด้งได้ทุกหน้า) */
export default function OrderAlerts({ alerts, onDismiss }) {
  const cancelled = alerts.find((a) => a.order.status === ORDER_STATUS.CANCELLED)
  const toasts = alerts.filter((a) => a.order.status !== ORDER_STATUS.CANCELLED)

  return (
    <>
      {toasts.length > 0 && (
        <div className="toast toast-top toast-center z-40 mt-14 w-full max-w-sm">
          {toasts.map((alert) => (
            <StatusToast key={alert.key} alert={alert} onDismiss={onDismiss} />
          ))}
        </div>
      )}
      {/* ยกเลิกหลายออร์เดอร์พร้อมกัน → แสดงทีละอัน กดรับทราบแล้วอันถัดไปจะขึ้นมา */}
      {cancelled && <CancelledPopup key={cancelled.key} alert={cancelled} onDismiss={onDismiss} />}
    </>
  )
}
