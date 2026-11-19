import { NavLink, useLocation } from 'react-router-dom'
import { ReceiptText, ShoppingBasket, UtensilsCrossed } from 'lucide-react'
import { useCart } from '../../../controllers/cart/useCart'
import { useSlidingIndicator } from '../../../controllers/useSlidingIndicator'
import SlidingIndicator from '../common/SlidingIndicator'

/** ตัวเลขในตะกร้า — key={count} ทำให้เด้ง (animate-pop) ทุกครั้งที่จำนวนเปลี่ยน */
function CountBadge({ count, className }) {
  return (
    <span key={count} className={`badge badge-num badge-primary animate-pop font-semibold ${className}`}>
      {count}
    </span>
  )
}

/**
 * แถบเมนูฝั่งลูกค้า (พื้นหลังของเมนูที่เลือกเลื่อนไหลตามหน้า)
 * - variant="dock": มือถือ ติดอยู่ด้านล่างจอ (dock ของ DaisyUI)
 * - variant="bar": จอใหญ่ อยู่บน header
 */
export default function CustomerNav({ variant = 'bar' }) {
  const { basePath, count } = useCart()
  const { pathname } = useLocation()
  const { containerRef, indicatorRef } = useSlidingIndicator(pathname)
  const links = [
    { to: basePath, label: 'เมนู', Icon: UtensilsCrossed, end: true },
    { to: `${basePath}/cart`, label: 'ตะกร้า', Icon: ShoppingBasket, badge: count },
    { to: `${basePath}/orders`, label: 'ออร์เดอร์ & บิล', Icon: ReceiptText },
  ]

  if (variant === 'dock') {
    return (
      <nav ref={containerRef} aria-label="เมนูลูกค้า" className="dock dock-md z-20 border-t border-base-300 bg-base-100">
        <SlidingIndicator indicatorRef={indicatorRef} className="rounded-box bg-primary/10" />
        {links.map(({ to, label, Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `relative z-10 transition-colors duration-300 ${isActive ? 'text-primary' : ''}`}
          >
            <span className="relative">
              <Icon size={22} aria-hidden="true" />
              {badge > 0 && <CountBadge count={badge} className="badge-xs absolute -top-2 -right-3 min-w-5" />}
            </span>
            <span className="dock-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    )
  }

  return (
    <nav ref={containerRef} aria-label="เมนูลูกค้า" className="relative flex gap-1">
      <SlidingIndicator indicatorRef={indicatorRef} className="rounded-field bg-primary/10" />
      {links.map(({ to, label, Icon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `btn btn-sm btn-ghost relative z-10 hover:bg-base-200/60 ${isActive ? 'text-primary hover:bg-transparent' : ''}`
          }
        >
          <Icon size={16} aria-hidden="true" />
          {label}
          {badge > 0 && <CountBadge count={badge} className="badge-sm" />}
        </NavLink>
      ))}
    </nav>
  )
}
