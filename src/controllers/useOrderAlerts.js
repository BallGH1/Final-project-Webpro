// Controller: ตรวจว่าสถานะออร์เดอร์เปลี่ยนไปจากรอบก่อนไหม (เทียบข้อมูลทุกครั้งที่ polling ได้ข้อมูลใหม่)
// ถ้าเปลี่ยน → เพิ่มเป็นการแจ้งเตือนให้ View แสดง popup/toast + เล่นเสียง
// ไม่ต้องใช้ WebSocket เพราะ useOrders ดึงข้อมูลใหม่ทุก 3 วินาทีอยู่แล้ว
import { useCallback, useEffect, useState } from 'react'
import { ORDER_STATUS } from '../models/orderModel'
import { playAlertSound } from '../models/alertSound'

export function useOrderAlerts(orders) {
  const [prevOrders, setPrevOrders] = useState(orders)
  const [alerts, setAlerts] = useState([])
  const [latest, setLatest] = useState(null) // การแจ้งเตือนล่าสุด ใช้สั่งเล่นเสียง

  // เทียบกับข้อมูลรอบก่อนตอน render (รูปแบบ "ปรับ state เมื่อ props เปลี่ยน" ตามเอกสาร React)
  // รอบแรกที่โหลด prevOrders ยังว่าง จึงไม่เด้งแจ้งเตือนของเก่าทั้งหมด
  if (orders !== prevOrders) {
    const before = new Map(prevOrders.map((o) => [o.id, o.status]))
    const changed = orders.filter((o) => before.has(o.id) && before.get(o.id) !== o.status)
    setPrevOrders(orders)
    if (changed.length > 0) {
      const added = changed.map((order) => ({ key: `${order.id}-${order.status}`, order }))
      setAlerts((list) => [...list.filter((a) => !added.some((n) => n.key === a.key)), ...added])
      setLatest(added.at(-1))
    }
  }

  // เล่นเสียงหลัง render (side effect ห้ามทำระหว่าง render)
  useEffect(() => {
    if (latest) playAlertSound(latest.order.status === ORDER_STATUS.CANCELLED ? 'error' : 'info')
  }, [latest])

  const dismiss = useCallback((key) => setAlerts((list) => list.filter((a) => a.key !== key)), [])

  return { alerts, dismiss }
}
