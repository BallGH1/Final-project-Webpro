import { Ban, CircleCheck, Clock, Flame } from 'lucide-react'
import { STATUS_LABEL } from '../../../models/orderModel'

const STYLES = {
  pending: { className: 'badge-warning', Icon: Clock },
  preparing: { className: 'badge-info', Icon: Flame },
  served: { className: 'badge-success', Icon: CircleCheck },
  cancelled: { className: 'badge-neutral', Icon: Ban },
}

export default function StatusBadge({ status }) {
  const { className, Icon } = STYLES[status] ?? STYLES.pending
  return (
    <span className={`badge badge-soft ${className} gap-1 font-semibold whitespace-nowrap`}>
      <Icon size={13} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  )
}
