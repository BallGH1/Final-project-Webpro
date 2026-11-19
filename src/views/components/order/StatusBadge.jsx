import { STATUS_LABEL } from '../../../models/orderModel'

const COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  preparing: 'bg-sky-100 text-sky-800',
  served: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-stone-200 text-stone-600',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${COLORS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}
