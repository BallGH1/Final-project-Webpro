// ข้อมูลไอคอนอาหาร — ข้อมูลเมนูใน server ยังเก็บเป็น emoji เหมือนเดิม
// หน้าเว็บแค่แปลง emoji → ไอคอนของ lucide-react ตอนแสดงผล (ไม่ต้องแก้ข้อมูลหรือ API)
import {
  Beef,
  Coffee,
  Cookie,
  CupSoda,
  Fish,
  GlassWater,
  Ham,
  LeafyGreen,
  Lollipop,
  Shrimp,
  Soup,
  Sprout,
  UtensilsCrossed,
  Wheat,
} from 'lucide-react'

// สีพื้นหลังของไอคอนแยกตามหมวด (ใช้ความโปร่งใส จึงอ่านได้ทั้งโหมดสว่างและมืด)
export const TONES = {
  pork: 'bg-rose-500/12 text-rose-600',
  beef: 'bg-red-500/12 text-red-700',
  seafood: 'bg-sky-500/12 text-sky-600',
  veg: 'bg-emerald-500/12 text-emerald-600',
  ball: 'bg-amber-500/15 text-amber-600',
  drink: 'bg-cyan-500/12 text-cyan-600',
  other: 'bg-primary/10 text-primary',
}

/** ไอคอนให้เลือกในฟอร์มเพิ่ม/แก้ไขเมนู (key = emoji ที่บันทึกลงข้อมูล) */
export const ICON_OPTIONS = [
  { key: '🍲', Icon: Soup, label: 'ทั่วไป', tone: 'other' },
  { key: '🥓', Icon: Ham, label: 'หมู', tone: 'pork' },
  { key: '🥩', Icon: Beef, label: 'เนื้อ', tone: 'beef' },
  { key: '🦐', Icon: Shrimp, label: 'กุ้ง', tone: 'seafood' },
  { key: '🦑', Icon: Fish, label: 'ปลา/หมึก', tone: 'seafood' },
  { key: '🥬', Icon: LeafyGreen, label: 'ผัก', tone: 'veg' },
  { key: '🍄', Icon: Sprout, label: 'เห็ด', tone: 'veg' },
  { key: '🌽', Icon: Wheat, label: 'ข้าวโพด', tone: 'veg' },
  { key: '🍢', Icon: Lollipop, label: 'ลูกชิ้น', tone: 'ball' },
  { key: '🧆', Icon: Cookie, label: 'เต้าหู้', tone: 'ball' },
  { key: '💧', Icon: GlassWater, label: 'น้ำเปล่า', tone: 'drink' },
  { key: '🍵', Icon: Coffee, label: 'ชา', tone: 'drink' },
  { key: '🥤', Icon: CupSoda, label: 'น้ำอัดลม', tone: 'drink' },
]

// emoji อื่นที่มีในข้อมูลเดิม → ใช้ไอคอนเดียวกับตัวที่ใกล้เคียง
const ALIASES = { '🐖': '🥓', '🐷': '🥓', '🐮': '🥩', '🍡': '🍢', '🧋': '🥤', '🐟': '🦑' }

const BY_KEY = Object.fromEntries(ICON_OPTIONS.map((option) => [option.key, option]))

export const CATEGORY_ICONS = {
  all: { Icon: UtensilsCrossed, tone: 'other' },
  pork: { Icon: Ham, tone: 'pork' },
  beef: { Icon: Beef, tone: 'beef' },
  seafood: { Icon: Shrimp, tone: 'seafood' },
  veg: { Icon: LeafyGreen, tone: 'veg' },
  ball: { Icon: Lollipop, tone: 'ball' },
  drink: { Icon: CupSoda, tone: 'drink' },
}

/** หาไอคอนจาก emoji ก่อน ถ้าไม่รู้จักใช้ไอคอนของหมวด ถ้าไม่มีอีกใช้หม้อสุกี้ */
export function resolveFoodIcon(emoji, categoryId) {
  return BY_KEY[emoji] ?? BY_KEY[ALIASES[emoji]] ?? CATEGORY_ICONS[categoryId] ?? BY_KEY['🍲']
}
