import { useEffect } from 'react'
import { Ban, CircleCheck, Flame } from 'lucide-react'
import { ORDER_STATUS } from '../../../models/orderModel'
import { formatMoney } from '../../../models/formatters'
import Button from '../common/Button'

const TOAST_MS = 4000

const TOASTS = {
  preparing: { className: 'alert-info', Icon: Flame, text: 'ครัวรับออร์เดอร์แล้ว กำลังเตรียมอาหาร' },
  served: { className: 'alert-success', Icon: CircleCheck, text: 'เสิร์ฟแล้ว ขอให้อร่อยนะ' },
}

/** toast เล็กมุมจอ หายเองใน 4 วินาที */
function StatusToast({ alert, onDismiss }) {
  const style = TOASTS[alert.order.status]

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(alert.key), TOAST_MS)
    return () => clearTimeout(timer)
  }, [alert.key, onDismiss])

  if (!style) return null
  const { className, Icon, text } = style
  return (
    <div role="status" className={`alert ${className} py-2.5 shadow-lg`}>
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
  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby={`cancel-${alert.key}`} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body items-center gap-3 p-6 text-center">
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
          <p className="text-xs text-base-content/60">ยอดของออร์เดอร์นี้ไม่ถูกนับในบิล สามารถสั่งเมนูอื่นแทนได้</p>
          <Button className="btn-block" onClick={() => onDismiss(alert.key)}>
            รับทราบ
          </Button>
        </div>
      </div>
    </div>
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
      {cancelled && <CancelledPopup alert={cancelled} onDismiss={onDismiss} />}
    </>
  )
}
