// Controller: บิลรวมของโต๊ะ (หน้าพนักงาน) — ดึงใหม่เป็นระยะ เผื่อลูกค้ายังสั่งเพิ่มหรือครัวเพิ่งเสิร์ฟ
import { useCallback, useEffect, useState } from 'react'
import { closeSession, getBill } from '../models/sessionModel'
import { POLL_INTERVAL } from '../models/orderModel'

export function useBill(sessionId) {
  const [bill, setBill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true

    function load() {
      getBill(sessionId)
        .then((data) => {
          if (!active) return
          setBill(data)
          setError('')
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
  }, [sessionId, refreshKey])

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), [])

  /** รับชำระแล้วปิดโต๊ะ (error จาก API โยนต่อให้ View แสดง) */
  async function close() {
    const closed = await closeSession(sessionId)
    setBill(closed)
    return closed
  }

  return { bill, loading, error, refresh, close }
}
