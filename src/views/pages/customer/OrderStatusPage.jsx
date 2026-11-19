// หน้าสถานะออร์เดอร์ (ลูกค้า): ดึงจากระบบกลางเป็นระยะ จึงเห็นสถานะที่พนักงานเปลี่ยน
import { useLocation } from 'react-router-dom'
import { CircleCheck, ReceiptText, UtensilsCrossed } from 'lucide-react'
import { useCart } from '../../../controllers/cart/useCart'
import { useOrders } from '../../../controllers/useOrders'
import OrderCard from '../../components/order/OrderCard'
import Button from '../../components/common/Button'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateMessages'

export default function OrderStatusPage() {
  const { tableId } = useCart()
  const { orders, loading, error, refresh } = useOrders({ tableId })
  const placedOrderNo = useLocation().state?.placedOrderNo

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">ออร์เดอร์ของโต๊ะ {tableId}</h1>
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

      {error && <ErrorState message={error} onRetry={refresh} />}

      {loading ? (
        <LoadingState text="กำลังโหลดออร์เดอร์..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="ยังไม่มีออร์เดอร์"
          action={
            <Button to={`/table/${tableId}`}>
              <UtensilsCrossed size={16} aria-hidden="true" />
              สั่งอาหาร
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} showProgress />
          ))}
        </div>
      )}
    </div>
  )
}
