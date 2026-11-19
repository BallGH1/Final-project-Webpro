// หน้าตะกร้า (ลูกค้า): ปรับจำนวน, ลบรายการ, ยืนยันการสั่งอาหาร
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        icon="🛒"
        title="ตะกร้ายังว่างอยู่"
        text="เลือกเมนูที่ต้องการแล้วกดเพิ่มลงตะกร้า"
        action={<Button to={`/table/${tableId}`}>ไปเลือกเมนู</Button>}
      />
    )
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h1 className="text-xl font-bold">ตะกร้าของโต๊ะ {tableId}</h1>
        <ul className="divide-y divide-stone-100">
          {items.map((line) => (
            <CartItemRow
              key={line.menuId}
              line={line}
              onChangeQty={(qty) => setQty(line.menuId, qty)}
              onRemove={() => removeItem(line.menuId)}
            />
          ))}
        </ul>
      </section>

      <aside className="h-fit space-y-4 rounded-xl border border-stone-200 bg-white p-4">
        <div>
          <label htmlFor="order-note">หมายเหตุถึงครัว</label>
          <textarea
            id="order-note"
            rows={3}
            maxLength={200}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น ไม่ใส่ผักชี, ขอน้ำซุปเพิ่ม"
          />
        </div>
        <div className="flex justify-between text-sm text-stone-500">
          <span>จำนวนทั้งหมด</span>
          <span>{count} รายการ</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>ยอดรวม</span>
          <span className="text-brand">{formatMoney(total)}</span>
        </div>
        {error && <ErrorState message={error} />}
        <Button size="lg" className="w-full" onClick={handleConfirm} disabled={submitting}>
          {submitting ? 'กำลังส่งออร์เดอร์...' : 'ยืนยันการสั่งอาหาร'}
        </Button>
      </aside>
    </div>
  )
}
