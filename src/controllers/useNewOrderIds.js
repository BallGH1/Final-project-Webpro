// Controller (UI): หาออร์เดอร์ที่ "เพิ่งเข้ามา" หลังเปิดหน้าแล้ว เพื่อให้การ์ดนั้นเรืองแสงสะดุดตาพนักงาน
// ออร์เดอร์ที่มีอยู่แล้วตอนเปิดหน้าครั้งแรกไม่นับว่าใหม่
import { useState } from 'react'

export function useNewOrderIds(orders, loading) {
  const [seenIds, setSeenIds] = useState(null) // null = ยังไม่ได้โหลดครั้งแรก
  const [newIds, setNewIds] = useState(() => new Set())
  const [prevOrders, setPrevOrders] = useState(orders)

  // เทียบตอน render (รูปแบบ "ปรับ state เมื่อ props เปลี่ยน" ตามเอกสาร React)
  if (!loading && seenIds === null) {
    setSeenIds(new Set(orders.map((o) => o.id)))
    setPrevOrders(orders)
  } else if (seenIds !== null && orders !== prevOrders) {
    setPrevOrders(orders)
    const fresh = orders.filter((o) => !seenIds.has(o.id)).map((o) => o.id)
    if (fresh.length > 0) {
      setSeenIds(new Set([...seenIds, ...fresh]))
      setNewIds(new Set(fresh))
    }
  }

  return newIds
}
