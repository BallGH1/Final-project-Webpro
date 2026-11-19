import Button from '../common/Button'
import { formatMoney } from '../../../models/formatters'

export default function MenuCard({ item, inCartQty = 0, onAdd }) {
  return (
    <article
      className={`flex flex-col rounded-xl border border-stone-200 bg-white p-4 shadow-sm ${
        item.available ? '' : 'opacity-60'
      }`}
    >
      <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-lg bg-brand-soft text-5xl">
        {item.image}
      </div>
      <h3 className="font-semibold">{item.name}</h3>
      <p className="mb-3 line-clamp-2 text-xs text-stone-500">{item.description}</p>
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="font-bold text-brand">{formatMoney(item.price)}</span>
        {item.available ? (
          <Button size="sm" onClick={() => onAdd(item)} aria-label={`เพิ่ม ${item.name} ลงตะกร้า`}>
            + เพิ่ม{inCartQty > 0 && ` (${inCartQty})`}
          </Button>
        ) : (
          <span className="text-xs font-medium text-stone-500">หมดชั่วคราว</span>
        )}
      </div>
    </article>
  )
}
