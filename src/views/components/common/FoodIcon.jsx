import { CATEGORY_ICONS, TONES, resolveFoodIcon } from './foodIcons'

/** ไอคอนของหมวดหมู่ (ใช้ในแท็บหมวด) */
export function CategoryIcon({ categoryId, size = 16, className = '' }) {
  const { Icon } = CATEGORY_ICONS[categoryId] ?? CATEGORY_ICONS.all
  return <Icon size={size} className={className} aria-hidden="true" />
}

/** กล่องไอคอนอาหารมีพื้นสีตามหมวด — ส่ง `emoji` จากข้อมูลเมนู/ออร์เดอร์ได้ตรง ๆ */
export default function FoodIcon({ emoji, categoryId, size = 24, className = '' }) {
  const { Icon, tone } = resolveFoodIcon(emoji, categoryId)
  const toneClass = TONES[categoryId] ?? TONES[tone] ?? TONES.other
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${toneClass} ${className}`} aria-hidden="true">
      <Icon size={size} strokeWidth={1.75} />
    </span>
  )
}
