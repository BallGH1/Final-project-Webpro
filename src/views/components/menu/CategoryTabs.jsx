import { ALL_CATEGORIES } from '../../../models/menuModel'

/** แถบเลือกหมวดหมู่ (เลื่อนแนวนอนได้บนมือถือ) */
export default function CategoryTabs({ categories, value, onChange }) {
  const tabs = [{ id: ALL_CATEGORIES, name: 'ทั้งหมด', icon: '🍲' }, ...categories]
  return (
    <div role="tablist" aria-label="หมวดหมู่อาหาร" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {tabs.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              active ? 'bg-brand text-white' : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        )
      })}
    </div>
  )
}
