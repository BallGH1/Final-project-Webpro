import { Minus, Plus, Trash2 } from 'lucide-react'
import { MAX_QTY } from '../../../models/cartModel'
import { formatMoney } from '../../../models/formatters'
import FoodImage from '../common/FoodImage'

export default function CartItemRow({ line, onChangeQty, onRemove }) {
  return (
    <li className="flex items-center gap-3 py-3">
      <FoodImage name={line.name} emoji={line.image} iconSize={22} className="size-12 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{line.name}</p>
        <p className="text-xs text-base-content/60">{formatMoney(line.price)} / ที่</p>
        <p className="text-sm font-semibold sm:hidden">{formatMoney(line.price * line.qty)}</p>
      </div>

      <div className="join items-center" aria-label={`จำนวน ${line.name}`}>
        <button type="button" aria-label="ลดจำนวน" className="btn join-item btn-sm btn-square max-sm:size-11" onClick={() => onChangeQty(line.qty - 1)}>
          <Minus size={14} aria-hidden="true" />
        </button>
        <span className="join-item flex h-8 w-9 items-center justify-center border-y border-base-300 bg-base-100 text-sm font-semibold max-sm:h-11">
          {line.qty}
        </span>
        <button
          type="button"
          aria-label="เพิ่มจำนวน"
          className="btn join-item btn-sm btn-square max-sm:size-11"
          onClick={() => onChangeQty(line.qty + 1)}
          disabled={line.qty >= MAX_QTY}
        >
          <Plus size={14} aria-hidden="true" />
        </button>
      </div>

      <span className="hidden w-20 text-right font-semibold sm:block">{formatMoney(line.price * line.qty)}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`ลบ ${line.name}`}
        className="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-error max-sm:size-11"
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </li>
  )
}
