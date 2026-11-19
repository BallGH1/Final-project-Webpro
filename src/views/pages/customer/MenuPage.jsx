// หน้าเมนู (ลูกค้า): ดูเมนูตามหมวด, ค้นหา, เพิ่มลงตะกร้า
import { useMenu, useMenuFilter } from '../../../controllers/useMenu'
import { useCart } from '../../../controllers/cart/useCart'
import SearchBar from '../../components/menu/SearchBar'
import CategoryTabs from '../../components/menu/CategoryTabs'
import MenuCard from '../../components/menu/MenuCard'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateMessages'

export default function MenuPage() {
  const { menu, categories, loading, error, reload } = useMenu()
  const { query, setQuery, categoryId, setCategoryId, filtered } = useMenuFilter(menu)
  const { items, addItem } = useCart()

  const qtyInCart = (menuId) => items.find((line) => line.menuId === menuId)?.qty ?? 0

  if (loading) return <LoadingState text="กำลังโหลดเมนู..." />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">เมนูอาหาร</h1>
      <SearchBar value={query} onChange={setQuery} />
      <CategoryTabs categories={categories} value={categoryId} onChange={setCategoryId} />

      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="ไม่พบเมนูที่ค้นหา" text="ลองเปลี่ยนคำค้นหาหรือหมวดหมู่" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} inCartQty={qtyInCart(item.id)} onAdd={addItem} />
          ))}
        </div>
      )}
    </div>
  )
}
