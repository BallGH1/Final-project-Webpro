// Controller: ดึงออร์เดอร์จากระบบกลางทุก POLL_INTERVAL (หน้าพนักงานเห็นออร์เดอร์ใหม่อัตโนมัติ)
import { useCallback, useEffect, useState } from 'react'
import { POLL_INTERVAL, getOrders, updateOrderStatus } from '../models/orderModel'
import { getSessionOrders } from '../models/sessionModel'

/**
 * @param {{ token?: string, enabled?: boolean }} options
 * ใส่ token = ออร์เดอร์เฉพาะบิลนี้ (หน้าลูกค้า), ไม่ใส่ = ทุกโต๊ะ (หน้าพนักงาน)
 * enabled = false หยุดดึงข้อมูล (เช่น บิลปิดแล้ว)
 */
export function useOrders({ token, enabled = true } = {}) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let active = true

    function load() {
      const fetchOrders = token ? getSessionOrders(token) : getOrders()
      fetchOrders
        .then((data) => {
          if (!active) return
          setOrders(data)
          setError('')
          setLastUpdated(new Date())
        })
        .catch((err) => active && setError(err.message))
        .finally(() => active && setLoading(false))
    }

    load()
    const timer = setInterval(load, POLL_INTERVAL)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [token, enabled, refreshKey])

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), [])

  async function changeStatus(orderId, status, reason) {
    const updated = await updateOrderStatus(orderId, status, reason)
    setOrders((list) => list.map((order) => (order.id === orderId ? updated : order)))
    return updated
  }

  return { orders, loading, error, lastUpdated, refresh, changeStatus }
}
