import { useState } from 'react'

/** ขั้นของเส้นตารางที่เป็นเลขกลม ๆ (1, 2, 5 × 10^n) */
function niceStep(raw) {
  if (raw <= 0) return 1
  const pow = 10 ** Math.floor(Math.log10(raw))
  const n = raw / pow
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow
}

const compact = (v) => (v >= 1000 ? `${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k` : String(v))

/**
 * กราฟแท่งแนวตั้ง 1 ชุดข้อมูล (สีเดียว = ขนาดของยอด) ทำเองด้วย HTML/CSS ไม่ใช้ไลบรารี
 * - แท่งงอกขึ้นทีละแท่งตอนโหลด, เปลี่ยนข้อมูลแล้วความสูงเลื่อนนุ่ม ๆ
 * - ชี้/แตะแท่ง → ป้ายบอกค่า และแท่งนั้นเข้มขึ้น
 * - มีตารางซ่อนไว้ให้ screen reader อ่านค่าได้ครบ
 */
export default function BarChart({ data, format, label, emptyText = 'ยังไม่มีข้อมูลในช่วงนี้' }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(0, ...data.map((d) => d.value))

  if (max === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-box border border-dashed border-base-300 text-sm text-base-content/70">
        {emptyText}
      </div>
    )
  }

  // เส้นแนวนอน 3 เส้นที่ค่ากลม ๆ
  const step = niceStep(max / 3)
  const top = Math.max(step * Math.ceil(max / step), step)
  const ticks = []
  for (let t = step; t <= top; t += step) ticks.push(t)
  // แกนล่าง: ถ้าแท่งเยอะ แสดงป้ายทุก ๆ n แท่ง
  const every = data.length > 16 ? Math.ceil(data.length / 8) : 1

  return (
    // ใช้ div แทน <figure> เพราะ daisyUI จัด figure ในการ์ดเป็น flex กลาง ทำให้กราฟหดแคบ
    <div role="figure" aria-label={label} className="space-y-2">
      <div className="relative h-56 pl-11" onMouseLeave={() => setHover(null)}>
        {/* เส้นตาราง + ค่าแกน Y (สีจาง ไม่แย่งสายตา) */}
        {ticks.map((t) => (
          <div key={t} className="absolute right-0 left-11 border-t border-dashed border-base-300" style={{ bottom: `${(t / top) * 100}%` }}>
            <span className="absolute -top-2.5 -left-11 w-9 text-right text-[11px] text-base-content/60 tabular-nums">
              {compact(t)}
            </span>
          </div>
        ))}
        <div className="absolute right-0 bottom-0 left-11 border-t border-base-300" />

        <div className="relative flex h-full items-end gap-[2px] sm:gap-1">
          {data.map((d, i) => {
            const active = hover === i
            return (
              <div
                key={d.key}
                className="relative flex h-full flex-1 cursor-pointer items-end"
                onMouseEnter={() => setHover(i)}
                onClick={() => setHover(active ? null : i)}
              >
                <div
                  className={`animate-grow-y w-full rounded-t-[4px] transition-[height,background-color] duration-500 ease-[var(--ease-soft)] ${
                    active ? 'bg-primary' : 'bg-primary/70'
                  }`}
                  style={{ height: `${(d.value / top) * 100}%`, minHeight: d.value > 0 ? 3 : 0, animationDelay: `${i * 25}ms` }}
                />
                {active && (
                  <div className="animate-fade-up pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 rounded-field bg-neutral px-2.5 py-1.5 text-center text-xs whitespace-nowrap text-neutral-content shadow-lg">
                    <div className="opacity-80">{d.label}</div>
                    <div className="font-semibold">{format(d.value)}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ป้ายแกน X */}
      <div className="flex gap-[2px] pl-11 sm:gap-1" aria-hidden="true">
        {data.map((d, i) => (
          <span key={d.key} className="flex-1 text-center text-[11px] text-base-content/60 tabular-nums">
            {i % every === 0 ? d.label.replace(':00', '') : ''}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.key}>
              <th scope="row">{d.label}</th>
              <td>{format(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
