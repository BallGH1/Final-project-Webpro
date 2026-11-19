import StatusBadge from './StatusBadge'
import { formatMoney, formatTime } from '../../../models/formatters'

/** การ์ดออร์เดอร์ — ใช้ทั้งหน้าลูกค้าและหน้าพนักงาน (`actions` คือปุ่มเปลี่ยนสถานะของพนักงาน) */
export default function OrderCard({ order, showTable = false, actions }) {
  return (
    <article className="flex flex-col rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-bold">
            {showTable && <span className="mr-2 text-brand">โต๊ะ {order.tableId}</span>}
            {order.orderNo}
          </h3>
          <p className="text-xs text-stone-500">สั่งเมื่อ {formatTime(order.createdAt)} น.</p>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <ul className="my-3 divide-y divide-stone-100 text-sm">
        {order.items.map((line) => (
          <li key={line.menuId} className="flex justify-between gap-2 py-1.5">
            <span>
              {line.image} {line.name} <span className="text-stone-500">× {line.qty}</span>
            </span>
            <span className="text-stone-600">{formatMoney(line.price * line.qty)}</span>
          </li>
        ))}
      </ul>

      {order.note && (
        <p className="mb-3 rounded-lg bg-brand-soft px-3 py-2 text-sm">📝 {order.note}</p>
      )}

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3">
        <span className="font-bold">รวม {formatMoney(order.total)}</span>
        {actions && <div className="flex gap-2">{actions}</div>}
      </footer>
    </article>
  )
}
