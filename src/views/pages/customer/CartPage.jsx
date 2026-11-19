// หน้าตะกร้า (ลูกค้า): ปรับจำนวน, ลบรายการ, ยืนยันการสั่งอาหาร
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBasket, Send, UtensilsCrossed } from 'lucide-react'
import { useCart } from '../../../controllers/cart/useCart'
import { usePlaceOrder } from '../../../controllers/usePlaceOrder'
import CartItemRow from '../../components/cart/CartItemRow'
import Button from '../../components/common/Button'
import { EmptyState, ErrorState } from '../../components/common/StateMessages'
import { formatMoney } from '../../../models/formatters'

export default function CartPage() {
  const { tableId, items, count, total, setQty, removeItem } = useCart()
  const { placeOrder, submitting, error } = usePlaceOrder()
  const [note, setNote] = useState('')
  const navigate = useNavigate()

  async function handleConfirm() {
    const order = await placeOrder(note)
    if (order) navigate(`/table/${tableId}/orders`, { state: { placedOrderNo: order.orderNo } })
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBasket}
        title="ตะกร้ายังว่างอยู่"
        text="เลือกเมนูที่ต้องการแล้วกดเพิ่มลงตะกร้า"
        action={
          <Button to={`/table/${tableId}`}>
            <UtensilsCrossed size={16} aria-hidden="true" />
            ไปเลือกเมนู
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px] lg:gap-5">
      <section className="card border border-base-300 bg-base-100">
        <div className="card-body p-4 sm:p-5">
          <h1 className="card-title text-xl">ตะกร้าของโต๊ะ {tableId}</h1>
          <ul className="divide-y divide-base-300">
            {items.map((line) => (
              <CartItemRow
                key={line.menuId}
                line={line}
                onChangeQty={(qty) => setQty(line.menuId, qty)}
                onRemove={() => removeItem(line.menuId)}
              />
            ))}
          </ul>
        </div>
      </section>

      <aside className="card h-fit border border-base-300 bg-base-100 lg:sticky lg:top-20">
        <div className="card-body gap-4 p-4 sm:p-5">
          <fieldset className="fieldset p-0">
            <label htmlFor="order-note" className="fieldset-legend pt-0 text-sm">
              หมายเหตุถึงครัว
            </label>
            <textarea
              id="order-note"
              rows={3}
              maxLength={200}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น ไม่ใส่ผักชี, ขอน้ำซุปเพิ่ม"
              className="textarea w-full"
            />
          </fieldset>
          <div className="space-y-1 border-t border-dashed border-base-300 pt-3">
            <div className="flex justify-between text-sm text-base-content/60">
              <span>จำนวนอาหาร</span>
              <span>{count} ที่</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-semibold">ยอดรวม</span>
              <span className="font-display text-2xl font-semibold text-primary">{formatMoney(total)}</span>
            </div>
          </div>
          {error && <ErrorState message={error} />}
          <Button size="lg" className="btn-block" onClick={handleConfirm} disabled={submitting}>
            {submitting ? <span className="loading loading-spinner loading-sm" /> : <Send size={18} aria-hidden="true" />}
            {submitting ? 'กำลังส่งออร์เดอร์...' : 'ยืนยันการสั่งอาหาร'}
          </Button>
        </div>
      </aside>
    </div>
  )
}
