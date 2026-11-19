import { Hand, Maximize2, Minus, Plus, Snowflake, AppWindow } from 'lucide-react'
import { PLAN_HEIGHT, PLAN_WIDTH, TABLE_LAYOUT, ZONES } from '../../../../shared/floorPlan.js'
import { usePanZoom } from '../../../controllers/usePanZoom'
import { useNow } from '../../../controllers/useNow'
import FloorTable from './FloorTable'

const ZONE_ICONS = { window: AppWindow, air: Snowflake }

const LEGEND = [
  { label: 'ว่าง', className: 'border-success bg-success/15' },
  { label: 'มีลูกค้า', className: 'border-warning bg-warning/25' },
  { label: 'ขอเช็กบิล', className: 'border-error bg-error/15' },
]

/**
 * ผังร้านแบบแผนที่: ลากพื้นผังเพื่อเลื่อนได้ทุกทิศ (นิ้ว / เมาส์) + ปุ่มซูมแบบนุ่ม ๆ
 * แตะโต๊ะ → onSelect(tableId) ให้หน้าแม่เปิดแผงรายละเอียด
 */
export default function FloorPlan({ tables, selectedId, onSelect }) {
  const { viewportRef, view, dragging, zoomIn, zoomOut, fit, canZoomIn, canZoomOut, panHandlers } = usePanZoom(
    PLAN_WIDTH,
    PLAN_HEIGHT,
  )
  const now = useNow()

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/70">
        {LEGEND.map(({ label, className }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`size-3 rounded border-2 ${className}`} aria-hidden="true" />
            {label}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1.5">
          <Hand size={14} aria-hidden="true" />
          ลากเพื่อเลื่อน · แตะโต๊ะเพื่อดูรายละเอียด
        </span>
      </div>

      <div
        ref={viewportRef}
        {...panHandlers}
        role="region"
        aria-label="ผังร้าน ลากเพื่อเลื่อนดูส่วนอื่น"
        className={`relative h-[calc(100dvh-15rem)] min-h-[420px] touch-none overflow-hidden rounded-box border border-base-300 bg-base-200 select-none ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* พื้นผัง (ขยับทั้งแผ่นด้วย transform) — ตอนลากไม่มี transition ให้ติดนิ้ว, ตอนซูมเลื่อนนุ่ม ๆ */}
        <div
          className={`absolute top-0 left-0 origin-top-left bg-[radial-gradient(var(--color-base-300)_1.5px,transparent_1.5px)] [background-size:28px_28px] ${
            dragging ? '' : 'transition-transform duration-[400ms] ease-[var(--ease-soft)]'
          }`}
          style={{
            width: PLAN_WIDTH,
            height: PLAN_HEIGHT,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          }}
        >
          {ZONES.map((zone) => {
            const Icon = ZONE_ICONS[zone.id]
            return (
              <div
                key={zone.id}
                className="absolute rounded-[28px] border border-base-300 bg-base-100/80"
                style={{ left: zone.x, top: zone.y, width: zone.w, height: zone.h }}
              >
                {zone.window && (
                  <span aria-hidden="true" className="absolute inset-x-8 top-0 h-1.5 rounded-b-full bg-info/50" />
                )}
                <span className="absolute top-5 left-6 flex items-center gap-1.5 text-sm font-semibold text-base-content/70">
                  {Icon && <Icon size={16} aria-hidden="true" />}
                  {zone.name}
                </span>
              </div>
            )
          })}

          {tables.map((table) => {
            const position = TABLE_LAYOUT[table.id]
            if (!position) return null // โต๊ะที่ยังไม่ได้วางในผัง (ดูได้ในมุมมองรายการ)
            return (
              <FloorTable
                key={table.id}
                table={table}
                position={position}
                selected={selectedId === table.id}
                now={now}
                onSelect={onSelect}
              />
            )
          })}
        </div>

        {/* ปุ่มซูม (data-pan-ignore: กดแล้วไม่เริ่มลากผัง) */}
        <div
          data-pan-ignore
          className="absolute right-3 bottom-3 flex flex-col gap-1 rounded-box border border-base-300 bg-base-100/90 p-1 shadow-sm backdrop-blur"
        >
          <button type="button" className="btn btn-ghost btn-square btn-sm max-sm:size-11" onClick={zoomIn} disabled={!canZoomIn} aria-label="ซูมเข้า">
            <Plus size={18} aria-hidden="true" />
          </button>
          <button type="button" className="btn btn-ghost btn-square btn-sm max-sm:size-11" onClick={zoomOut} disabled={!canZoomOut} aria-label="ซูมออก">
            <Minus size={18} aria-hidden="true" />
          </button>
          <button type="button" className="btn btn-ghost btn-square btn-sm max-sm:size-11" onClick={fit} aria-label="จัดผังให้พอดีจอ">
            <Maximize2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
