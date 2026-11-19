// Controller: ดึงออร์เดอร์จากระบบกลางทุก POLL_INTERVAL (หน้าพนักงานเห็นออร์เดอร์ใหม่อัตโนมัติ)
import { useCallback, useEffect, useState } from 'react'
import { POLL_INTERVAL, getOrders, updateOrderStatus } from '../models/orderModel'

/** @param {{ tableId?: string }} options ไม่ใส่ tableId = ดึงทุกโต๊ะ (หน้าพนักงาน) */
export function useOrders({ tableId } = {}) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true

    function load() {
      getOrders({ tableId })
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
  }, [tableId, refreshKey])

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), [])

  async function changeStatus(orderId, status) {
    const updated = await updateOrderStatus(orderId, status)
    setOrders((list) => list.map((order) => (order.id === orderId ? updated : order)))
    return updated
  }

  return { orders, loading, error, lastUpdated, refresh, changeStatus }
}
