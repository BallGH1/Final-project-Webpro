import { useState } from 'react'
import { Armchair, Ban, ChevronDown, Clock, StickyNote } from 'lucide-react'
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

// ย่อรายการเมื่อเกิน 6 บรรทัด → แสดง 5 บรรทัดแรก + ปุ่ม "ดูอีก n รายการ"
// (ถ้าซ่อนแค่ 1 บรรทัด แสดงให้ครบเลยดีกว่าให้กดเพิ่ม)
const PREVIEW_COUNT = 5
const COLLAPSE_AFTER = PREVIEW_COUNT + 1

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
export default function OrderCard({ order, showTable = false, showProgress = false, actions, className = '', style }) {
  const stepIndex = STEPS.findIndex((step) => step.status === order.status)

  // ออร์เดอร์ใหญ่: แสดงแค่บางรายการก่อน การ์ดจะได้ไม่ยาวจนปุ่มหลุดจอ
  const [expanded, setExpanded] = useState(false)
  const collapsible = order.items.length > COLLAPSE_AFTER
  const firstItems = collapsible ? order.items.slice(0, PREVIEW_COUNT) : order.items
  const restItems = collapsible ? order.items.slice(PREVIEW_COUNT) : []
  const hiddenCount = order.items.length - PREVIEW_COUNT
  const totalQty = order.items.reduce((sum, line) => sum + line.qty, 0)
  const listId = `order-items-${order.id}`

  const renderLine = (line, index) => (
    <li key={`${line.menuId}-${index}`} className="flex items-center justify-between gap-2 py-1.5">
      <span className="flex min-w-0 items-center gap-2">
        <FoodImage name={line.name} emoji={line.image} iconSize={15} className="size-8 rounded-lg" />
        <span className="truncate">{line.name}</span>
        <span className="shrink-0 text-base-content/60">× {line.qty}</span>
      </span>
      <span className="shrink-0 text-base-content/70">{formatMoney(line.price * line.qty)}</span>
    </li>
  )

  return (
    <article
      style={style}
      className={`card border border-l-4 border-base-300 bg-base-100 shadow-sm transition-[opacity,border-color] duration-500 ${
        STRIPES[order.status] ?? ''
      } ${order.status === 'cancelled' ? 'opacity-70' : ''} ${className}`}
    >
      <div className="card-body gap-3 p-4">
        <header className="flex flex-wrap items-start justify-between gap-2">
          {/* space-y-1.5: เว้นที่ให้สระ/วรรณยุกต์ด้านบนของบรรทัด "สั่งเมื่อ..." ไม่ชนป้ายโต๊ะ */}
          <div className="min-w-0 space-y-1.5">
            <h3 className="flex flex-wrap items-center gap-2 font-display text-lg font-semibold">
              {showTable && (
                <span className="badge badge-primary gap-1 font-semibold">
                  <Armchair size={12} aria-hidden="true" />
                  โต๊ะ {order.tableId}
                </span>
              )}
              {order.orderNo}
            </h3>
            <p className="flex items-center gap-1 text-xs text-base-content/70">
              <Clock size={12} aria-hidden="true" />
              สั่งเมื่อ {formatTime(order.createdAt)} น. · {order.items.length} รายการ · {totalQty} ที่
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

        <div id={listId} className="text-sm">
          <ul className="divide-y divide-base-300">{firstItems.map(renderLine)}</ul>
          {collapsible && (
            // กาง/หุบแบบนุ่ม: เปลี่ยนความสูงแถว grid จาก 0fr → 1fr (ไม่ต้องรู้ความสูงจริงล่วงหน้า)
            <div
              className="grid transition-[grid-template-rows] duration-[400ms] ease-[var(--ease-soft)]"
              style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
            >
              <ul inert={!expanded} className="min-h-0 divide-y divide-base-300 overflow-hidden border-t border-base-300">
                {restItems.map((line, index) => renderLine(line, index + PREVIEW_COUNT))}
              </ul>
            </div>
          )}
        </div>

        {collapsible && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded((open) => !open)}
            className="btn btn-ghost btn-sm -mt-2 w-full text-base-content/70 max-sm:min-h-11"
          >
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            />
            {expanded ? 'ย่อรายการ' : `ดูอีก ${hiddenCount} รายการ`}
          </button>
        )}

        {order.status === 'cancelled' && order.cancelReason && (
          <p className="flex items-start gap-2 rounded-field bg-error/10 px-3 py-2 text-sm text-error">
            <Ban size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
            ยกเลิกเพราะ: {order.cancelReason}
          </p>
        )}

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
