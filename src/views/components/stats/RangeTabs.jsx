import { RANGES } from '../../../models/statsModel'
import { useSlidingIndicator } from '../../../controllers/useSlidingIndicator'
import SlidingIndicator from '../common/SlidingIndicator'

/** เลือกช่วงเวลา วันนี้ / 7 วัน / 30 วัน (พื้นหลังเลื่อนตามแบบแท็บอื่นในระบบ) */
export default function RangeTabs({ value, onChange }) {
  const { containerRef, indicatorRef } = useSlidingIndicator(value)
  return (
    <div ref={containerRef} role="tablist" aria-label="ช่วงเวลา" className="relative flex w-fit rounded-field bg-base-300/50 p-1">
      <SlidingIndicator indicatorRef={indicatorRef} className="rounded-field bg-base-100 shadow-sm" />
      {RANGES.map((range) => (
        <button
          key={range.id}
          type="button"
          role="tab"
          aria-selected={value === range.id}
          onClick={() => onChange(range.id)}
          className={`btn btn-sm btn-ghost relative z-10 hover:bg-transparent max-sm:min-h-11 ${
            value === range.id ? 'text-base-content' : 'text-base-content/70'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
