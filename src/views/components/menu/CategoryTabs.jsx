import { ALL_CATEGORIES } from '../../../models/menuModel'
import { useSlidingIndicator } from '../../../controllers/useSlidingIndicator'
import { CategoryIcon } from '../common/FoodIcon'
import SlidingIndicator from '../common/SlidingIndicator'

/** แถบเลือกหมวดหมู่ (เลื่อนแนวนอนได้บนมือถือ) — พื้นสีแดงเลื่อนไหลไปหาหมวดที่เลือก */
export default function CategoryTabs({ categories, value, onChange }) {
  const tabs = [{ id: ALL_CATEGORIES, name: 'ทั้งหมด' }, ...categories]
  const { containerRef, indicatorRef } = useSlidingIndicator(`${value}-${categories.length}`)

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      <div ref={containerRef} role="tablist" aria-label="หมวดหมู่อาหาร" className="relative flex w-max gap-2">
        <SlidingIndicator indicatorRef={indicatorRef} className="rounded-full bg-primary shadow-sm" />
        {tabs.map((tab) => {
          const active = tab.id === value
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.id)}
              className={`btn btn-sm relative z-10 shrink-0 rounded-full border-base-300 bg-transparent font-medium shadow-none max-sm:min-h-11 ${
                active ? 'border-transparent text-primary-content' : 'hover:bg-base-100'
              }`}
            >
              <CategoryIcon categoryId={tab.id} size={15} />
              {tab.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
