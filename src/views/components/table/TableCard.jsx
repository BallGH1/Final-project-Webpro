import { Clock, DoorOpen, QrCode, ReceiptText, Users } from 'lucide-react'
import { SESSION_STATUS } from '../../../models/sessionModel'
import { formatMoney, formatTime } from '../../../models/formatters'
import Button from '../common/Button'
import SessionBadge from './SessionBadge'

// กรอบการ์ดตามสถานะ — โต๊ะที่ขอเช็กบิลเด่นที่สุด
const BORDERS = {
  open: 'border-warning/60',
  billing: 'border-error ring-2 ring-error/30',
}

/**
 * การ์ดโต๊ะ 1 ตัวในหน้าจัดการโต๊ะ
 * - โต๊ะว่าง: ปุ่ม "เปิดโต๊ะ"
 * - มีลูกค้า/ขอเช็กบิล: แสดงยอดปัจจุบัน + ปุ่ม QR และ ดูบิล
 */
export default function TableCard({ table, busy, onOpen, onShowQr }) {
  const { session } = table

  return (
    <article className={`card border bg-base-100 shadow-sm ${session ? BORDERS[session.status] : 'border-base-300'}`}>
      <div className="card-body gap-3 p-4">
        <header className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
          <div>
            <h2 className="font-display text-2xl font-semibold">{table.id}</h2>
            <p className="flex items-center gap-1 text-xs whitespace-nowrap text-base-content/60">
              <Users size={12} aria-hidden="true" />
              {table.seats} ที่นั่ง
            </p>
          </div>
          <SessionBadge status={session?.status} />
        </header>

        {session ? (
          <>
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-1 text-base-content/60">
                <Clock size={13} aria-hidden="true" />
                {session.billNo} · เปิดเมื่อ {formatTime(session.openedAt)} น.
              </p>
              <p className="text-base-content/60">
                {session.orderCount} ออร์เดอร์
                {session.unfinished > 0 && (
                  <span className="badge badge-warning badge-soft badge-sm ml-2">รอเสิร์ฟ {session.unfinished}</span>
                )}
              </p>
              <p className="font-display text-xl font-semibold text-primary">{formatMoney(session.total)}</p>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2 whitespace-nowrap">
              <Button size="sm" variant="secondary" onClick={() => onShowQr(session)}>
                <QrCode size={14} aria-hidden="true" />
                QR
              </Button>
              <Button
                size="sm"
                variant={session.status === SESSION_STATUS.BILLING ? 'primary' : 'secondary'}
                to={`/staff/tables/bill/${session.id}`}
              >
                <ReceiptText size={14} aria-hidden="true" />
                บิล
              </Button>
            </div>
          </>
        ) : (
          <Button size="sm" className="mt-auto" onClick={() => onOpen(table)} disabled={busy}>
            {busy ? <span className="loading loading-spinner loading-xs" /> : <DoorOpen size={14} aria-hidden="true" />}
            เปิดโต๊ะ
          </Button>
        )}
      </div>
    </article>
  )
}
