// หน้าออร์เดอร์ & บิล (ลูกค้า): เห็นเฉพาะออร์เดอร์ของบิลนี้ + ยอดรวม + ปุ่มขอเช็กบิล
// ดึงจากระบบกลางเป็นระยะ จึงเห็นสถานะที่พนักงานเปลี่ยน
import { useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import { CircleCheck, HandCoins, ReceiptText, UtensilsCrossed } from 'lucide-react'
import { useCart } from '../../../controllers/cart/useCart'
import { SESSION_STATUS } from '../../../models/sessionModel'
import { formatMoney, formatTime } from '../../../models/formatters'
import OrderCard from '../../components/order/OrderCard'
import RequestBillModal from '../../components/order/RequestBillModal'
import Button from '../../components/common/Button'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateMessages'
import MasonryGrid from '../../components/common/MasonryGrid'

export default function OrderStatusPage() {
  const { basePath } = useCart()
  // ออร์เดอร์ดึงไว้แล้วที่ CustomerLayout (ใช้ข้อมูลชุดเดียวกับระบบแจ้งเตือน)
  const { session, requestBill, ordersState } = useOutletContext()
  const { orders, loading, error, refresh } = ordersState
  const placedOrderNo = useLocation().state?.placedOrderNo
  const [confirmOpen, setConfirmOpen] = useState(false) // หน้าต่างยืนยันเช็กบิล

  // error จะโยนกลับไปให้หน้าต่างยืนยันแสดง
  async function handleRequestBill() {
    await requestBill()
    setConfirmOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">ออร์เดอร์ของโต๊ะ {session.tableId}</h1>
          <p className="text-sm text-base-content/60">
            บิล {session.billNo} · เปิดโต๊ะเมื่อ {formatTime(session.openedAt)} น.
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-base-content/60">
          <span className="status status-success animate-pulse" aria-hidden="true" />
          อัปเดตอัตโนมัติ
        </span>
      </div>

      {placedOrderNo && (
        <div role="status" className="alert alert-success alert-soft">
          <CircleCheck size={20} aria-hidden="true" />
          <span>
            ส่งออร์เดอร์ <b>{placedOrderNo}</b> เรียบร้อย ครัวกำลังรับออร์เดอร์
          </span>
        </div>
      )}

      {/* สรุปบิล + ปุ่มเช็กบิล */}
      <section className="card border border-base-300 bg-base-100">
        <div className="card-body flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-sm text-base-content/60">ยอดรวมทั้งบิล ({session.orderCount} ออร์เดอร์)</p>
            <p className="font-display text-3xl font-semibold text-primary">{formatMoney(session.total)}</p>
          </div>
          {session.status === SESSION_STATUS.OPEN ? (
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => setConfirmOpen(true)}
              disabled={session.orderCount === 0}
            >
              <HandCoins size={18} aria-hidden="true" />
              เช็กบิล
            </Button>
          ) : (
            <span className="badge badge-warning badge-lg gap-1.5 py-4">
              <HandCoins size={16} aria-hidden="true" />
              รอพนักงานมาเก็บเงิน
            </span>
          )}
        </div>
      </section>

      {confirmOpen && (
        <RequestBillModal session={session} onConfirm={handleRequestBill} onClose={() => setConfirmOpen(false)} />
      )}

      {error && <ErrorState message={error} onRetry={refresh} />}

      {loading ? (
        <LoadingState text="กำลังโหลดออร์เดอร์..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="ยังไม่มีออร์เดอร์"
          action={
            <Button to={basePath}>
              <UtensilsCrossed size={16} aria-hidden="true" />
              สั่งอาหาร
            </Button>
          }
        />
      ) : (
        <MasonryGrid breakpoints={{ 0: 1, 768: 2 }}>
          {orders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              showProgress
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            />
          ))}
        </MasonryGrid>
      )}
    </div>
  )
}
