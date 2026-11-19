import { Link, Outlet, useParams } from 'react-router-dom'
import { useTable } from '../../controllers/useTables'
import { CartProvider } from '../../controllers/cart/CartProvider'
import CustomerNav from '../components/layout/CustomerNav'
import Button from '../components/common/Button'
import { ErrorState, LoadingState } from '../components/common/StateMessages'

export default function CustomerLayout() {
  const { tableId } = useParams()
  const { table, loading, error } = useTable(tableId)

  if (loading) return <LoadingState text="กำลังตรวจสอบโต๊ะ..." />
  if (error) {
    return (
      <main className="mx-auto max-w-md space-y-4 p-6">
        <ErrorState message={error} />
        <Button to="/" variant="secondary">
          กลับหน้าแรก
        </Button>
      </main>
    )
  }

  return (
    // key={table.id} ทำให้ตะกร้าเริ่มใหม่เมื่อเปลี่ยนโต๊ะ
    <CartProvider key={table.id} tableId={table.id}>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link to={`/table/${table.id}`} className="text-lg font-bold text-brand">
              🍲 Suki Order
            </Link>
            <div className="hidden sm:block">
              <CustomerNav />
            </div>
            <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-dark">
              โต๊ะ {table.id}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-5 pb-24 sm:pb-10">
          <Outlet />
        </main>

        <div className="sm:hidden">
          <CustomerNav />
        </div>
      </div>
    </CartProvider>
  )
}
