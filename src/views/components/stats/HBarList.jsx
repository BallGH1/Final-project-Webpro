/**
 * รายการพร้อมแท่งแนวนอน (เมนูขายดี, ยอดตามหมวด) — แท่งยาวตามค่า งอกจากซ้ายทีละแถว
 * items: [{ key, label, value, detail?, leading? }]
 */
export default function HBarList({ items, format, emptyText = 'ยังไม่มีข้อมูลในช่วงนี้' }) {
  const max = Math.max(0, ...items.map((i) => i.value))
  if (max === 0) {
    return (
      <p className="rounded-box border border-dashed border-base-300 px-4 py-8 text-center text-sm text-base-content/70">
        {emptyText}
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={item.key} className="animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              {item.leading}
              <span className="truncate font-medium">{item.label}</span>
              {item.detail && <span className="shrink-0 text-xs text-base-content/70">{item.detail}</span>}
            </span>
            <span className="shrink-0 font-semibold tabular-nums">{format(item.value)}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-base-200">
            <div
              className="animate-grow-x h-full rounded-full bg-primary/80 transition-[width] duration-500 ease-[var(--ease-soft)]"
              style={{ width: `${(item.value / max) * 100}%`, animationDelay: `${index * 60 + 100}ms` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
