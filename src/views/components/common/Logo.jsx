import { Soup } from 'lucide-react'

/** โลโก้ร้าน: ไอคอนหม้อสุกี้ + ชื่อร้าน */
export default function Logo({ subtitle, className = '' }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-content">
        <Soup size={20} aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-semibold">Suki Teeyai</span>
        {subtitle && <span className="block text-xs font-normal opacity-60">{subtitle}</span>}
      </span>
    </span>
  )
}
