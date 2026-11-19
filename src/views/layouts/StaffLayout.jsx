// Layout หลังร้าน: Navbar + Sidebar + <Outlet /> (แบบ AdminLayout ใน Lab 11)
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ClipboardList, LayoutGrid, Store, UtensilsCrossed } from 'lucide-react'
import Logo from '../components/common/Logo'
import ThemeToggle from '../components/layout/ThemeToggle'
import { readStorage, writeStorage } from '../../models/storage'
import { useSlidingIndicator } from '../../controllers/useSlidingIndicator'
import SlidingIndicator from '../components/common/SlidingIndicator'

const LINKS = [
  { to: '/staff', label: 'ออร์เดอร์', Icon: ClipboardList, end: true },
  { to: '/staff/menu', label: 'จัดการเมนู', Icon: UtensilsCrossed },
  { to: '/staff/tables', label: 'โต๊ะ & บิล', Icon: LayoutGrid },
]

const THEME_KEY = 'suki-staff-theme'

export default function StaffLayout() {
  // Dark Mode ใช้เฉพาะหน้าพนักงาน: ตั้ง data-theme ที่ div นี้ และจำค่าไว้ใน localStorage
  const [theme, setTheme] = useState(() => (readStorage(THEME_KEY, 'suki') === 'suki-dark' ? 'suki-dark' : 'suki'))

  useEffect(() => {
    writeStorage(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === 'suki' ? 'suki-dark' : 'suki'))

  // พื้นหลังของเมนูที่เลือกเลื่อนไหลตามหน้า (แท็บมี z-10 อยู่เหนือพื้นหลัง)
  const { pathname } = useLocation()
  const { containerRef: navContainerRef, indicatorRef: navIndicatorRef } = useSlidingIndicator(pathname)
  const navClass = ({ isActive }) =>
    `btn btn-sm btn-ghost relative z-10 shrink-0 justify-start gap-2 hover:bg-base-200/60 max-md:min-h-11 md:btn-md ${
      isActive ? 'text-primary hover:bg-transparent' : ''
    }`

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200 text-base-content">
      <header className="navbar sticky top-0 z-20 border-b border-base-300 bg-base-100 px-4 print:hidden">
        <div className="flex-1">
          <Link to="/staff" aria-label="หน้าออร์เดอร์">
            <Logo subtitle="หลังร้าน" />
          </Link>
        </div>
        <div className="flex flex-none items-center gap-1">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          {/* มือถือเหลือแค่ไอคอน จึงต้องมี aria-label ให้ screen reader อ่านได้ */}
          <Link to="/" aria-label="หน้าร้าน" className="btn btn-outline btn-sm border-base-300 max-sm:size-11">
            <Store size={16} aria-hidden="true" />
            <span className="hidden sm:inline">หน้าร้าน</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[2200px] grid-cols-1 gap-4 p-4 md:grid-cols-[220px_1fr] md:gap-6 md:p-6 print:block print:p-0">
        <aside className="h-fit rounded-box bg-base-100 p-2 shadow-sm md:sticky md:top-20 md:p-3 print:hidden">
          <p className="mb-2 hidden px-3 text-xs font-semibold tracking-wider opacity-50 md:block">เมนูพนักงาน</p>
          {/* มือถือ: เมนูเรียงแนวนอน, จอ md ขึ้นไป: เรียงแนวตั้งใน Sidebar */}
          <nav ref={navContainerRef} aria-label="เมนูพนักงาน" className="relative flex flex-row gap-1 overflow-x-auto md:flex-col">
            <SlidingIndicator indicatorRef={navIndicatorRef} className="rounded-field bg-primary/10" />
            {LINKS.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={navClass}>
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          {/* key เปลี่ยนตามหน้า → เนื้อหาหน้าใหม่จางเข้า */}
          <div key={pathname} className="animate-page-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
