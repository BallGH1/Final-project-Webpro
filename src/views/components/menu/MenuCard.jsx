import { Plus } from 'lucide-react'
import FoodImage from '../common/FoodImage'
import { formatMoney } from '../../../models/formatters'

/** `orderable={false}` ซ่อนปุ่มเพิ่ม (เช่น ลูกค้าขอเช็กบิลแล้ว) */
export default function MenuCard({ item, inCartQty = 0, onAdd, orderable = true }) {
  return (
    <article
      className={`card border border-base-300 bg-base-100 transition hover:-translate-y-0.5 hover:shadow-md ${
        item.available ? '' : 'opacity-60'
      }`}
    >
      <div className="relative p-2.5 pb-0">
        <FoodImage
          name={item.name}
          emoji={item.image}
          categoryId={item.categoryId}
          iconSize={44}
          className="aspect-[4/3] w-full max-w-full rounded-[calc(var(--radius-box)-0.25rem)]"
        />
        {inCartQty > 0 && (
          <span className="badge badge-primary badge-sm absolute top-4 right-4 font-semibold">ในตะกร้า {inCartQty}</span>
        )}
        {!item.available && <span className="badge badge-neutral badge-sm absolute top-4 left-4">หมดชั่วคราว</span>}
      </div>
      <div className="card-body gap-1 p-3 sm:p-4">
        <h3 className="font-display text-base leading-snug font-semibold">{item.name}</h3>
        <p className="line-clamp-2 min-h-8 text-xs text-base-content/60">{item.description}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-display text-lg font-semibold text-primary">{formatMoney(item.price)}</span>
          {item.available && orderable && (
            <button
              type="button"
              className="btn btn-primary btn-sm btn-circle max-sm:size-11 sm:btn-wide sm:w-auto sm:rounded-full sm:px-3"
              onClick={() => onAdd(item)}
              aria-label={`เพิ่ม ${item.name} ลงตะกร้า`}
            >
              <Plus size={16} aria-hidden="true" />
              <span className="hidden sm:inline">เพิ่ม</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
