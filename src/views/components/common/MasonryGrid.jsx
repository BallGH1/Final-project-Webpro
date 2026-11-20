// การ์ดหลายคอลัมน์แบบ Pinterest (masonry): การ์ดในคอลัมน์เดียวกันต่อกันเลย ไม่มีช่องว่างใต้การ์ดสั้น
// แบ่งการ์ดลงคอลัมน์แบบ "วนซ้ายไปขวา" (ใบ 1 → คอลัมน์ 1, ใบ 2 → คอลัมน์ 2, ...)
// ลำดับจึงยังอ่านจากซ้ายไปขวาเหมือน grid ปกติ (ต่างจาก CSS columns ที่เรียงบนลงล่างทีละคอลัมน์)
import { Children, useEffect, useState } from 'react'

/**
 * จำนวนคอลัมน์ตามความกว้างจอ เช่น { 0: 1, 640: 2, 1280: 3 }
 * (key = ความกว้างขั้นต่ำเป็น px) — อัปเดตเองเมื่อย่อ/ขยายหน้าต่าง
 */
function useColumnCount(breakpoints) {
  const pick = () => {
    const width = window.innerWidth
    let count = 1
    for (const [min, cols] of Object.entries(breakpoints)) if (width >= Number(min)) count = cols
    return count
  }
  const [count, setCount] = useState(pick)

  useEffect(() => {
    const onResize = () => setCount(pick())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // breakpoints เป็นค่าคงที่ของแต่ละหน้า
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return count
}

export default function MasonryGrid({ breakpoints, className = '', children }) {
  const count = useColumnCount(breakpoints)
  const columns = Array.from({ length: count }, () => [])
  Children.toArray(children).forEach((child, index) => columns[index % count].push(child))

  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {columns.map((items, index) => (
        <div key={index} className="flex min-w-0 flex-1 flex-col gap-4">
          {items}
        </div>
      ))}
    </div>
  )
}
