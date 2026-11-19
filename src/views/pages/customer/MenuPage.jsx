// หน้าเมนู (ลูกค้า): ดูเมนูตามหมวด, ค้นหา, เพิ่มลงตะกร้า
import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { CircleCheck, SearchX } from 'lucide-react'
import { useMenu, useMenuFilter } from '../../../controllers/useMenu'
import { useCart } from '../../../controllers/cart/useCart'
import { canOrder } from '../../../models/sessionModel'
import SearchBar from '../../components/menu/SearchBar'
import CategoryTabs from '../../components/menu/CategoryTabs'
import MenuCard from '../../components/menu/MenuCard'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateMessages'

export default function MenuPage() {
  const { menu, categories, loading, error, reload } = useMenu()
  const { query, setQuery, categoryId, setCategoryId, filtered } = useMenuFilter(menu)
  const { basePath, items, addItem } = useCart()
  const { session } = useOutletContext()
  const orderable = canOrder(session.status)
  // toast แจ้งว่าเพิ่มลงตะกร้าแล้ว (หายเองหลัง 2 วินาที)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(timer)
  }, [toast])

  const qtyInCart = (menuId) => items.find((line) => line.menuId === menuId)?.qty ?? 0

  function handleAdd(item) {
    addItem(item)
    setToast({ name: item.name, at: Date.now() })
  }

  if (loading) return <LoadingState text="กำลังโหลดเมนู..." />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">เมนูอาหาร</h1>
        <span className="text-sm text-base-content/60">{filtered.length} รายการ</span>
      </div>
      <SearchBar value={query} onChange={setQuery} />
      <CategoryTabs categories={categories} value={categoryId} onChange={setCategoryId} />

      {filtered.length === 0 ? (
        <EmptyState icon={SearchX} title="ไม่พบเมนูที่ค้นหา" text="ลองเปลี่ยนคำค้นหาหรือหมวดหมู่" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              inCartQty={qtyInCart(item.id)}
              onAdd={handleAdd}
              orderable={orderable}
            />
          ))}
        </div>
      )}

      {toast && (
        <div className="toast toast-center z-30 mb-20 sm:mb-2" role="status">
          <div key={toast.at} className="alert alert-success py-2.5 shadow-lg">
            <CircleCheck size={18} aria-hidden="true" />
            <span>เพิ่ม {toast.name} แล้ว</span>
            <Link to={`${basePath}/cart`} className="btn btn-xs btn-ghost underline">
              ดูตะกร้า
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
