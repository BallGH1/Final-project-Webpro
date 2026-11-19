import { NavLink } from 'react-router-dom'
import { ReceiptText, ShoppingBasket, UtensilsCrossed } from 'lucide-react'
import { useCart } from '../../../controllers/cart/useCart'

/**
 * แถบเมนูฝั่งลูกค้า
 * - variant="dock": มือถือ ติดอยู่ด้านล่างจอ (dock ของ DaisyUI)
 * - variant="bar": จอใหญ่ อยู่บน header
 */
export default function CustomerNav({ variant = 'bar' }) {
  const { basePath, count } = useCart()
  const links = [
    { to: basePath, label: 'เมนู', Icon: UtensilsCrossed, end: true },
    { to: `${basePath}/cart`, label: 'ตะกร้า', Icon: ShoppingBasket, badge: count },
    { to: `${basePath}/orders`, label: 'ออร์เดอร์ & บิล', Icon: ReceiptText },
  ]

  if (variant === 'dock') {
    return (
      <nav aria-label="เมนูลูกค้า" className="dock dock-md z-20 border-t border-base-300 bg-base-100">
        {links.map(({ to, label, Icon, end, badge }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'dock-active text-primary' : '')}>
            <span className="relative">
              <Icon size={22} aria-hidden="true" />
              {badge > 0 && (
                <span className="badge badge-primary badge-xs absolute -top-2 -right-3 min-w-5 font-semibold">{badge}</span>
              )}
            </span>
            <span className="dock-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    )
  }

  return (
    <nav aria-label="เมนูลูกค้า" className="flex gap-1">
      {links.map(({ to, label, Icon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary btn-soft' : 'btn-ghost'}`}
        >
          <Icon size={16} aria-hidden="true" />
          {label}
          {badge > 0 && <span className="badge badge-primary badge-sm">{badge}</span>}
        </NavLink>
      ))}
    </nav>
  )
}
