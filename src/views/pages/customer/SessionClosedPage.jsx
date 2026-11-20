// หน้าที่ลูกค้าเห็นเมื่อบิลถูกปิดแล้ว (จ่ายเงินแล้ว หรือสแกน QR เก่า)
// มีสรุปรายการที่สั่งทั้งบิล กดกาง/หุบดูได้ (เหมือนใบเสร็จ)
import { useState } from 'react'
import { ChevronDown, HeartHandshake, ReceiptText } from 'lucide-react'
import Logo from '../../components/common/Logo'
import FoodImage from '../../components/common/FoodImage'
import { formatDateTime, formatMoney } from '../../../models/formatters'

export default function SessionClosedPage({ session }) {
  const [showItems, setShowItems] = useState(false)
  const lines = session.lines ?? []
  const totalQty = lines.reduce((sum, line) => sum + line.qty, 0)

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <Logo />
      <section className="card animate-fade-up w-full border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body items-center gap-3 p-6">
          <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
            <HeartHandshake size={32} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-semibold">ขอบคุณที่ใช้บริการ</h1>
          <p className="text-sm text-base-content/70">
            บิล {session.billNo} · โต๊ะ {session.tableId} ชำระเงินเรียบร้อยแล้ว
          </p>
          <p className="font-display text-3xl font-semibold text-primary">{formatMoney(session.total)}</p>
          {session.closedAt && (
            <p className="text-xs text-base-content/70">ปิดบิลเมื่อ {formatDateTime(session.closedAt)}</p>
          )}

          {/* สรุปรายการที่สั่ง: กดเพื่อกาง/หุบ */}
          {lines.length > 0 && (
            <div className="w-full rounded-box border border-base-300 text-left">
              <button
                type="button"
                aria-expanded={showItems}
                aria-controls="closed-bill-items"
                onClick={() => setShowItems((open) => !open)}
                className="flex min-h-12 w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium"
              >
                <span className="flex items-center gap-2">
                  <ReceiptText size={16} aria-hidden="true" />
                  {showItems ? 'ซ่อนรายการ' : 'ดูรายการที่สั่ง'} ({lines.length} รายการ · {totalQty} ที่)
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={`shrink-0 transition-transform duration-300 ${showItems ? 'rotate-180' : ''}`}
                />
              </button>

              {/* กาง/หุบแบบนุ่ม: grid-template-rows 0fr → 1fr */}
              <div
                className="grid transition-[grid-template-rows] duration-[400ms] ease-[var(--ease-soft)]"
                style={{ gridTemplateRows: showItems ? '1fr' : '0fr' }}
              >
                <div id="closed-bill-items" inert={!showItems} className="min-h-0 overflow-hidden">
                  <ul className="divide-y divide-base-300 border-t border-base-300 px-4 text-sm">
                    {lines.map((line) => (
                      <li key={`${line.menuId}-${line.price}`} className="flex items-center justify-between gap-2 py-2">
                        <span className="flex min-w-0 items-center gap-2">
                          <FoodImage name={line.name} emoji={line.image} iconSize={14} className="size-9 rounded-lg" />
                          <span className="min-w-0">
                            <span className="block truncate">{line.name}</span>
                            <span className="text-xs text-base-content/70">
                              {formatMoney(line.price)} × {line.qty}
                            </span>
                          </span>
                        </span>
                        <span className="shrink-0 font-medium">{formatMoney(line.price * line.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-baseline justify-between border-t border-dashed border-base-300 px-4 py-3">
                    <span className="font-semibold">ยอดรวมทั้งสิ้น</span>
                    <span className="font-display text-lg font-semibold text-primary">{formatMoney(session.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="mt-1 rounded-field bg-base-200 px-3 py-2 text-sm text-base-content/70">
            QR Code นี้ใช้สั่งอาหารไม่ได้แล้ว หากต้องการสั่งเพิ่ม กรุณาติดต่อพนักงาน
          </p>
        </div>
      </section>
    </main>
  )
}
