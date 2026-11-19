import { Armchair, Clock, StickyNote } from 'lucide-react'
import StatusBadge from './StatusBadge'
import FoodImage from '../common/FoodImage'
import { formatMoney, formatTime } from '../../../models/formatters'

// แถบสีด้านซ้ายของการ์ด บอกสถานะได้ทันทีที่มอง
const STRIPES = {
  pending: 'border-l-warning',
  preparing: 'border-l-info',
  served: 'border-l-success',
  cancelled: 'border-l-base-300',
}

// ขั้นตอนของออร์เดอร์ (steps ของ DaisyUI) — แสดงให้ลูกค้าเห็นว่าถึงไหนแล้ว
const STEPS = [
  { status: 'pending', label: 'รอรับออร์เดอร์' },
  { status: 'preparing', label: 'กำลังเตรียม' },
  { status: 'served', label: 'เสิร์ฟแล้ว' },
]

/**
 * การ์ดออร์เดอร์ — ใช้ทั้งหน้าลูกค้าและหน้าพนักงาน
 * `actions` คือปุ่มเปลี่ยนสถานะของพนักงาน, `showProgress` แสดงขั้นตอนให้ลูกค้า
 */
export default function OrderCard({ order, showTable = false, showProgress = false, actions }) {
  const stepIndex = STEPS.findIndex((step) => step.status === order.status)

  return (
    <article
      className={`card border border-l-4 border-base-300 bg-base-100 shadow-sm ${STRIPES[order.status] ?? ''} ${
        order.status === 'cancelled' ? 'opacity-70' : ''
      }`}
    >
      <div className="card-body gap-3 p-4">
        <header className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="flex flex-wrap items-center gap-2 font-display text-lg font-semibold">
              {showTable && (
                <span className="badge badge-primary gap-1 font-semibold">
                  <Armchair size={12} aria-hidden="true" />
                  โต๊ะ {order.tableId}
                </span>
              )}
              {order.orderNo}
            </h3>
            <p className="flex items-center gap-1 text-xs text-base-content/60">
              <Clock size={12} aria-hidden="true" />
              สั่งเมื่อ {formatTime(order.createdAt)} น.
            </p>
          </div>
          <StatusBadge status={order.status} />
        </header>

        {showProgress && stepIndex >= 0 && (
          <ul className="steps steps-horizontal w-full text-xs">
            {STEPS.map((step, index) => (
              <li key={step.status} className={`step ${index <= stepIndex ? 'step-primary' : ''}`}>
                {step.label}
              </li>
            ))}
          </ul>
        )}

        <ul className="divide-y divide-base-300 text-sm">
          {order.items.map((line, index) => (
            <li key={`${line.menuId}-${index}`} className="flex items-center justify-between gap-2 py-1.5">
              <span className="flex min-w-0 items-center gap-2">
                <FoodImage name={line.name} emoji={line.image} iconSize={15} className="size-8 rounded-lg" />
                <span className="truncate">{line.name}</span>
                <span className="shrink-0 text-base-content/60">× {line.qty}</span>
              </span>
              <span className="shrink-0 text-base-content/70">{formatMoney(line.price * line.qty)}</span>
            </li>
          ))}
        </ul>

        {order.note && (
          <p className="flex items-start gap-2 rounded-field bg-secondary/15 px-3 py-2 text-sm">
            <StickyNote size={15} className="mt-0.5 shrink-0 text-secondary-content/70" aria-hidden="true" />
            {order.note}
          </p>
        )}

        <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-base-300 pt-3">
          <span className="font-display text-lg font-semibold">รวม {formatMoney(order.total)}</span>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </footer>
      </div>
    </article>
  )
}
