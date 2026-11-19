import { Link, NavLink, Outlet } from 'react-router-dom'

const LINKS = [
  { to: '/staff', label: 'ออร์เดอร์', icon: '🧾', end: true },
  { to: '/staff/menu', label: 'จัดการเมนู', icon: '📋' },
  { to: '/staff/tables', label: 'QR โต๊ะ', icon: '📱' },
]

export default function StaffLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-stone-900 text-white print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/staff" className="text-lg font-bold">
            🍲 Suki Teeyai <span className="text-sm font-normal text-stone-400">| หลังร้าน</span>
          </Link>
          <nav aria-label="เมนูพนักงาน" className="flex gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-medium ${
                    isActive ? 'bg-brand text-white' : 'text-stone-300 hover:bg-stone-800'
                  }`
                }
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
