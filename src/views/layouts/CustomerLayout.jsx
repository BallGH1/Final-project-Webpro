// Layout ฝั่งลูกค้า (/t/:token): ตรวจ token จาก QR → แสดงหน้าสั่งอาหารของบิลนั้น
// ส่งข้อมูลบิลให้หน้าลูกทางหน้า Outlet context (อ่านด้วย useOutletContext)
import { Link, Outlet, useParams } from 'react-router-dom'
import { Armchair, House, ReceiptText } from 'lucide-react'
import { useSession } from '../../controllers/useSession'
import { useOrders } from '../../controllers/useOrders'
import { useOrderAlerts } from '../../controllers/useOrderAlerts'
import OrderAlerts from '../components/order/OrderAlerts'
import { CartProvider } from '../../controllers/cart/CartProvider'
import { SESSION_STATUS, customerPath } from '../../models/sessionModel'
import { formatMoney } from '../../models/formatters'
import CustomerNav from '../components/layout/CustomerNav'
import Button from '../components/common/Button'
import Logo from '../components/common/Logo'
import { ErrorState, LoadingState } from '../components/common/StateMessages'
import SessionClosedPage from '../pages/customer/SessionClosedPage'

export default function CustomerLayout() {
  const { token } = useParams()
  const { session, loading, error, refresh, requestBill } = useSession(token)
  // ดึงออร์เดอร์ที่ Layout (ไม่ใช่ที่หน้าออร์เดอร์) เพื่อให้แจ้งเตือนเด้งได้ทุกหน้าของลูกค้า
  const active = Boolean(session) && session.status !== SESSION_STATUS.CLOSED
  const ordersState = useOrders({ token, enabled: active })
  const { alerts, dismiss } = useOrderAlerts(ordersState.orders)

  if (loading) return <LoadingState text="กำลังตรวจสอบ QR Code..." />
  if (!session) {
    return (
      <main className="mx-auto max-w-md space-y-4 p-6">
        <ErrorState message={error || 'ไม่พบบิลนี้'} />
        <Button to="/" variant="secondary">
          <House size={16} aria-hidden="true" />
          กลับหน้าแรก
        </Button>
      </main>
    )
  }
  if (session.status === SESSION_STATUS.CLOSED) return <SessionClosedPage session={session} />

  return (
    // key={token} ทำให้ตะกร้าเริ่มใหม่เมื่อเป็นบิลใหม่
    <CartProvider key={token} token={token} tableId={session.tableId}>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-base-300 bg-base-100/95 backdrop-blur">
          <div className="navbar mx-auto min-h-14 max-w-5xl gap-3 px-4">
            <div className="flex-1">
              <Link to={customerPath(token)} aria-label="กลับไปหน้าเมนู" className="flex min-h-11 items-center">
                <Logo />
              </Link>
            </div>
            <div className="hidden sm:block">
              <CustomerNav variant="bar" />
            </div>
            <span className="badge badge-primary badge-soft gap-1.5 px-3 py-3 font-semibold">
              <Armchair size={14} aria-hidden="true" />
              โต๊ะ {session.tableId}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 space-y-4 px-4 pt-5 pb-28 sm:pb-10">
          {session.status === SESSION_STATUS.BILLING && (
            <div role="status" className="alert alert-warning alert-soft">
              <ReceiptText size={20} aria-hidden="true" />
              <span>
                ขอเช็กบิลแล้ว ยอดรวม <b>{formatMoney(session.total)}</b> · พนักงานกำลังมาเก็บเงิน (สั่งอาหารเพิ่มไม่ได้)
              </span>
            </div>
          )}
          <Outlet context={{ session, refreshSession: refresh, requestBill, ordersState }} />
        </main>

        <div className="sm:hidden">
          <CustomerNav variant="dock" />
        </div>

        <OrderAlerts alerts={alerts} onDismiss={dismiss} />
      </div>
    </CartProvider>
  )
}
