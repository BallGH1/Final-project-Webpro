import { NavLink } from 'react-router-dom'
import { useCart } from '../../../controllers/cart/useCart'

/** แถบเมนูฝั่งลูกค้า: มือถืออยู่ด้านล่างจอ, จอใหญ่อยู่บน header */
export default function CustomerNav() {
  const { tableId, count } = useCart()
  const base = `/table/${tableId}`
  const links = [
    { to: base, label: 'เมนู', icon: '🍲', end: true },
    { to: `${base}/cart`, label: 'ตะกร้า', icon: '🛒', badge: count },
    { to: `${base}/orders`, label: 'ออร์เดอร์ของฉัน', icon: '🧾' },
  ]

  return (
    <nav
      aria-label="เมนูลูกค้า"
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-stone-200 bg-white sm:static sm:gap-1 sm:border-0 sm:bg-transparent"
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `relative flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium whitespace-nowrap sm:flex-row sm:gap-2 sm:rounded-lg sm:px-3 sm:text-sm ${
              isActive ? 'text-brand sm:bg-brand-soft' : 'text-stone-500 hover:text-stone-800'
            }`
          }
        >
          <span className="text-lg sm:text-base">{link.icon}</span>
          {link.label}
          {link.badge > 0 && (
            <span className="absolute top-1 right-[calc(50%-1.75rem)] rounded-full bg-brand px-1.5 text-[10px] text-white sm:static">
              {link.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
