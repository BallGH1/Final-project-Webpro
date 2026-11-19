// หน้าสถานะออร์เดอร์ (ลูกค้า): ดึงจากระบบกลางเป็นระยะ จึงเห็นสถานะที่พนักงานเปลี่ยน
import { useLocation } from 'react-router-dom'
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
      <h1 className="text-2xl font-bold">ออร์เดอร์ของโต๊ะ {tableId}</h1>

      {placedOrderNo && (
        <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-800">
          ✅ ส่งออร์เดอร์ {placedOrderNo} เรียบร้อย กรุณารอสักครู่
        </p>
      )}

      {error && <ErrorState message={error} onRetry={refresh} />}

      {loading ? (
        <LoadingState text="กำลังโหลดออร์เดอร์..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="ยังไม่มีออร์เดอร์"
          action={<Button to={`/table/${tableId}`}>สั่งอาหาร</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
