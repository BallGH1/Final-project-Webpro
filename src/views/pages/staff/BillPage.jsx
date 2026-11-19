// หน้าบิล (พนักงาน): รวมรายการอาหารทั้งรอบ + ยอดรวม → รับชำระแล้วปิดโต๊ะ
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft, CircleCheck, Clock, HandCoins, TriangleAlert } from 'lucide-react'
import { useBill } from '../../../controllers/useBill'
import { SESSION_STATUS } from '../../../models/sessionModel'
import { formatMoney, formatTime } from '../../../models/formatters'
import Button from '../../components/common/Button'
import FoodImage from '../../components/common/FoodImage'
import SessionBadge from '../../components/table/SessionBadge'
import CloseBillModal from '../../components/table/CloseBillModal'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateMessages'

export default function BillPage() {
  const { sessionId } = useParams()
  const { bill, loading, error, refresh, close } = useBill(sessionId)
  const [confirmOpen, setConfirmOpen] = useState(false) // หน้าต่างยืนยันปิดโต๊ะ

  // error จะโยนกลับไปให้หน้าต่างยืนยันแสดง
  async function handleClose() {
    try {
      await close()
      setConfirmOpen(false)
    } catch (err) {
      refresh()
      throw err
    }
  }

  const backButton = (
    <Button to="/staff/tables" variant="ghost" size="sm">
      <ArrowLeft size={16} aria-hidden="true" />
      โต๊ะทั้งหมด
    </Button>
  )

  if (loading) return <LoadingState text="กำลังโหลดบิล..." />
  if (!bill) {
    return (
      <div className="space-y-4">
        {backButton}
        <ErrorState message={error || 'ไม่พบบิลนี้'} onRetry={refresh} />
      </div>
    )
  }

  const isClosed = bill.status === SESSION_STATUS.CLOSED

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {backButton}

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            บิล {bill.billNo} · โต๊ะ {bill.tableId}
          </h1>
          <p className="flex items-center gap-1 text-sm text-base-content/60">
            <Clock size={13} aria-hidden="true" />
            เปิดโต๊ะ {formatTime(bill.openedAt)} น.
            {bill.billRequestedAt && ` · ขอเช็กบิล ${formatTime(bill.billRequestedAt)} น.`}
            {bill.closedAt && ` · ปิดบิล ${formatTime(bill.closedAt)} น.`}
          </p>
        </div>
        <SessionBadge status={bill.status} />
      </div>

      {error && <ErrorState message={error} onRetry={refresh} />}

      {isClosed && (
        <div role="status" className="alert alert-success alert-soft">
          <CircleCheck size={20} aria-hidden="true" />
          <span>รับชำระเรียบร้อย โต๊ะ {bill.tableId} ว่างแล้ว พร้อมรับลูกค้ารอบถัดไป</span>
        </div>
      )}

      {!isClosed && bill.unfinished > 0 && (
        <div role="alert" className="alert alert-warning alert-soft flex flex-wrap justify-between">
          <span className="flex items-center gap-2">
            <TriangleAlert size={18} aria-hidden="true" />
            ยังมีออร์เดอร์ที่ยังไม่เสิร์ฟ {bill.unfinished} รายการ ต้องเสิร์ฟหรือยกเลิกก่อนปิดโต๊ะ
          </span>
          <Button to="/staff" size="sm" variant="secondary">
            ไปหน้าออร์เดอร์
          </Button>
        </div>
      )}

      <section className="card border border-base-300 bg-base-100">
        <div className="card-body gap-3 p-4 sm:p-5">
          <h2 className="card-title text-lg">รายการอาหาร ({bill.orderCount} ออร์เดอร์)</h2>
          {bill.lines.length === 0 ? (
            <EmptyState title="ยังไม่มีรายการอาหาร" text="ลูกค้ายังไม่ได้สั่ง หรือออร์เดอร์ถูกยกเลิกทั้งหมด" />
          ) : (
            <ul className="divide-y divide-base-300 text-sm">
              {bill.lines.map((line) => (
                <li key={`${line.menuId}-${line.price}`} className="flex items-center justify-between gap-2 py-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <FoodImage name={line.name} emoji={line.image} iconSize={15} className="size-9 rounded-lg" />
                    <span className="min-w-0">
                      <span className="block truncate">{line.name}</span>
                      <span className="text-xs text-base-content/60">
                        {formatMoney(line.price)} × {line.qty}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 font-medium">{formatMoney(line.price * line.qty)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-baseline justify-between border-t border-dashed border-base-300 pt-3">
            <span className="font-semibold">ยอดรวมทั้งสิ้น</span>
            <span className="font-display text-3xl font-semibold text-primary">{formatMoney(bill.total)}</span>
          </div>
        </div>
      </section>

      {!isClosed && (
        <Button size="lg" className="btn-block" onClick={() => setConfirmOpen(true)} disabled={bill.unfinished > 0}>
          <HandCoins size={18} aria-hidden="true" />
          ชำระแล้ว / ปิดโต๊ะ
        </Button>
      )}

      {confirmOpen && !isClosed && (
        <CloseBillModal bill={bill} onConfirm={handleClose} onClose={() => setConfirmOpen(false)} />
      )}
    </div>
  )
}
