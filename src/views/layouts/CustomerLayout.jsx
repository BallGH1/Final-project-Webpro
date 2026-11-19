import { Link, Outlet, useParams } from 'react-router-dom'
import { Armchair, House } from 'lucide-react'
import { useTable } from '../../controllers/useTables'
import { CartProvider } from '../../controllers/cart/CartProvider'
import CustomerNav from '../components/layout/CustomerNav'
import Button from '../components/common/Button'
import Logo from '../components/common/Logo'
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
          <House size={16} aria-hidden="true" />
          กลับหน้าแรก
        </Button>
      </main>
    )
  }

  return (
    // key={table.id} ทำให้ตะกร้าเริ่มใหม่เมื่อเปลี่ยนโต๊ะ
    <CartProvider key={table.id} tableId={table.id}>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-base-300 bg-base-100/95 backdrop-blur">
          <div className="navbar mx-auto min-h-14 max-w-5xl gap-3 px-4">
            <div className="flex-1">
              <Link to={`/table/${table.id}`} aria-label="กลับไปหน้าเมนู">
                <Logo />
              </Link>
            </div>
            <div className="hidden sm:block">
              <CustomerNav variant="bar" />
            </div>
            <span className="badge badge-primary badge-soft gap-1.5 px-3 py-3 font-semibold">
              <Armchair size={14} aria-hidden="true" />
              โต๊ะ {table.id}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-5 pb-28 sm:pb-10">
          <Outlet />
        </main>

        <div className="sm:hidden">
          <CustomerNav variant="dock" />
        </div>
      </div>
    </CartProvider>
  )
}
