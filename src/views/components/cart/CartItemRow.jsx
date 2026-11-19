import { MAX_QTY } from '../../../models/cartModel'
import { formatMoney } from '../../../models/formatters'

export default function CartItemRow({ line, onChangeQty, onRemove }) {
  return (
    <li className="flex items-center gap-3 py-3">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-2xl">
        {line.image}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{line.name}</p>
        <p className="text-xs text-stone-500">{formatMoney(line.price)} / ที่</p>
      </div>

      <div className="flex items-center gap-1" aria-label={`จำนวน ${line.name}`}>
        <QtyButton label="ลดจำนวน" onClick={() => onChangeQty(line.qty - 1)}>
          −
        </QtyButton>
        <span className="w-8 text-center font-semibold">{line.qty}</span>
        <QtyButton label="เพิ่มจำนวน" onClick={() => onChangeQty(line.qty + 1)} disabled={line.qty >= MAX_QTY}>
          +
        </QtyButton>
      </div>

      <span className="hidden w-20 text-right font-semibold sm:block">{formatMoney(line.price * line.qty)}</span>
      <button type="button" onClick={onRemove} aria-label={`ลบ ${line.name}`} className="rounded p-1 text-stone-400 hover:text-red-600">
        ✕
      </button>
    </li>
  )
}

function QtyButton({ label, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="size-8 rounded-full border border-stone-300 text-lg leading-none hover:bg-stone-100"
      {...props}
    >
      {children}
    </button>
  )
}
