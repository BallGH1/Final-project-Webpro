import { ALL_CATEGORIES } from '../../../models/menuModel'
import { CategoryIcon } from '../common/FoodIcon'

/** แถบเลือกหมวดหมู่ (เลื่อนแนวนอนได้บนมือถือ) */
export default function CategoryTabs({ categories, value, onChange }) {
  const tabs = [{ id: ALL_CATEGORIES, name: 'ทั้งหมด' }, ...categories]
  return (
    <div role="tablist" aria-label="หมวดหมู่อาหาร" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      {tabs.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`btn btn-sm shrink-0 rounded-full font-medium max-sm:min-h-11 ${
              active ? 'btn-primary' : 'border-base-300 bg-base-100 hover:bg-base-200'
            }`}
          >
            <CategoryIcon categoryId={tab.id} size={15} />
            {tab.name}
          </button>
        )
      })}
    </div>
  )
}
