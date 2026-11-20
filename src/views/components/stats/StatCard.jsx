import { TrendingDown, TrendingUp } from 'lucide-react'
import { useCountUp } from '../../../controllers/useCountUp'

/**
 * กล่องตัวเลขสรุป 1 ช่อง: ตัวเลขไหลนุ่ม ๆ ไปหาค่าใหม่ + เทียบกับช่วงก่อนหน้า
 * `goodWhenUp=false` ใช้กับตัวเลขที่ "ลดลง = ดี" เช่น อัตรายกเลิก, เวลารอ
 */
export default function StatCard({ icon: Icon, label, value, format, sub, change, compareLabel, goodWhenUp = true, delay = 0 }) {
  const animated = useCountUp(value ?? 0)
  const hasChange = change !== null && change !== undefined && Number.isFinite(change)
  const up = hasChange && change >= 0
  const good = hasChange && (up === goodWhenUp || Math.abs(change) < 0.5)

  return (
    <article className="card animate-fade-up border border-base-300 bg-base-100 shadow-sm" style={{ animationDelay: `${delay}ms` }}>
      <div className="card-body gap-1 p-4 sm:p-5">
        <p className="flex items-center gap-2 text-sm text-base-content/70">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon size={16} aria-hidden="true" />
          </span>
          {label}
        </p>
        <p className="mt-1 font-display text-3xl font-semibold tabular-nums">
          {value === null || value === undefined ? '–' : format(animated)}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-base-content/70">
          {hasChange && (
            <span
              className={`badge badge-sm badge-soft gap-1 font-semibold ${good ? 'badge-success' : 'badge-error'}`}
              title={`เทียบกับ${compareLabel}`}
            >
              {up ? <TrendingUp size={12} aria-hidden="true" /> : <TrendingDown size={12} aria-hidden="true" />}
              {up ? '+' : ''}
              {change.toFixed(0)}%
            </span>
          )}
          {hasChange && <span>จาก{compareLabel}</span>}
          {sub && <span>{sub}</span>}
        </div>
      </div>
    </article>
  )
}
