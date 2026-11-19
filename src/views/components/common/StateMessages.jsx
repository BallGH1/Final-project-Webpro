// ข้อความสถานะที่ใช้ซ้ำทุกหน้า: กำลังโหลด / เกิดข้อผิดพลาด / ไม่มีข้อมูล
import Button from './Button'

export function LoadingState({ text = 'กำลังโหลด...' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-stone-500">
      <span className="size-5 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
      {text}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
    >
      <span>⚠️ {message}</span>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          ลองใหม่
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ icon = '🍽️', title, text, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
      <span className="text-4xl">{icon}</span>
      <h2 className="text-lg font-semibold">{title}</h2>
      {text && <p className="text-sm text-stone-500">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
