// ข้อความสถานะที่ใช้ซ้ำทุกหน้า: กำลังโหลด / เกิดข้อผิดพลาด / ไม่มีข้อมูล (ใช้ loading, alert ของ DaisyUI)
import { useEffect, useState } from 'react'
import { CircleAlert, Inbox, RefreshCw } from 'lucide-react'
import Button from './Button'

// โหลดเสร็จเร็วกว่านี้จะไม่แสดง spinner เลย (กันจอกะพริบเหมือนรีเฟรชตอนเปลี่ยนหน้า)
const SPINNER_DELAY_MS = 300

export function LoadingState({ text = 'กำลังโหลด...' }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), SPINNER_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  // ระหว่างรอ: กันพื้นที่ไว้ความสูงเท่าเดิม แต่ยังไม่แสดงอะไร
  if (!visible) return <div className="py-16" aria-hidden="true" />

  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-base-content/60">
      <span className="loading loading-spinner text-primary" />
      {text}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="alert alert-error alert-soft flex flex-wrap items-center justify-between gap-3">
      <span className="flex items-center gap-2">
        <CircleAlert size={18} aria-hidden="true" />
        {message}
      </span>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw size={14} aria-hidden="true" />
          ลองใหม่
        </Button>
      )}
    </div>
  )
}

/** `icon` คือไอคอนจาก lucide-react เช่น icon={ShoppingBasket} */
export function EmptyState({ icon: Icon = Inbox, title, text, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center">
      <span className="mb-1 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      {text && <p className="text-sm text-base-content/60">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
