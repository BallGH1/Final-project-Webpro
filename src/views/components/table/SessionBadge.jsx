import { CircleCheck, HandCoins, Users } from 'lucide-react'
import { SESSION_LABEL } from '../../../models/sessionModel'

// ไม่มีบิล (status = undefined) = โต๊ะว่าง
const STYLES = {
  free: { className: 'badge-success', Icon: CircleCheck, label: 'ว่าง' },
  open: { className: 'badge-warning', Icon: Users, label: SESSION_LABEL.open },
  billing: { className: 'badge-error', Icon: HandCoins, label: SESSION_LABEL.billing },
  closed: { className: 'badge-neutral', Icon: CircleCheck, label: SESSION_LABEL.closed },
}

/** ป้ายสถานะโต๊ะ/บิล */
export default function SessionBadge({ status }) {
  const { className, Icon, label } = STYLES[status] ?? STYLES.free
  return (
    <span className={`badge badge-soft ${className} gap-1 font-semibold whitespace-nowrap`}>
      <Icon size={13} aria-hidden="true" />
      {label}
    </span>
  )
}
