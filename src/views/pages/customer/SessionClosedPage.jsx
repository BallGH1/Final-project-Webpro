// หน้าที่ลูกค้าเห็นเมื่อบิลถูกปิดแล้ว (จ่ายเงินแล้ว หรือสแกน QR เก่า)
import { HeartHandshake } from 'lucide-react'
import Logo from '../../components/common/Logo'
import { formatDateTime, formatMoney } from '../../../models/formatters'

export default function SessionClosedPage({ session }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <Logo />
      <section className="card w-full border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body items-center gap-3 p-6">
          <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
            <HeartHandshake size={32} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-semibold">ขอบคุณที่ใช้บริการ</h1>
          <p className="text-sm text-base-content/60">
            บิล {session.billNo} · โต๊ะ {session.tableId} ชำระเงินเรียบร้อยแล้ว
          </p>
          <p className="font-display text-3xl font-semibold text-primary">{formatMoney(session.total)}</p>
          {session.closedAt && (
            <p className="text-xs text-base-content/50">ปิดบิลเมื่อ {formatDateTime(session.closedAt)}</p>
          )}
          <p className="mt-2 rounded-field bg-base-200 px-3 py-2 text-sm text-base-content/70">
            QR Code นี้ใช้สั่งอาหารไม่ได้แล้ว หากต้องการสั่งเพิ่ม กรุณาติดต่อพนักงาน
          </p>
        </div>
      </section>
    </main>
  )
}
