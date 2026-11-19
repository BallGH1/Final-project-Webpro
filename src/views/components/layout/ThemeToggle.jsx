import { Moon, Sun } from 'lucide-react'

/** ปุ่มสลับโหมดสว่าง/มืด (แบบ ThemeToggle ใน Lab 11) — ค่าธีมเก็บไว้ที่ StaffLayout */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'suki-dark'
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm btn-square"
      onClick={onToggle}
      aria-label={isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
      title={isDark ? 'โหมดสว่าง' : 'โหมดมืด'}
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  )
}
