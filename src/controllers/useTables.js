// Controller: สถานะโต๊ะทั้งร้าน (หน้าพนักงาน) — ดึงใหม่ทุก POLL_INTERVAL จึงเห็นโต๊ะที่ขอเช็กบิลทันที
import { useCallback, useEffect, useState } from 'react'
import { getTables, openTable as openTableApi } from '../models/tableModel'
import { POLL_INTERVAL } from '../models/orderModel'

export function useTables() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true

    function load() {
      getTables()
        .then((data) => {
          if (!active) return
          setTables(data)
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
  }, [refreshKey])

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), [])

  /** เปิดโต๊ะ → ได้บิลใหม่พร้อม token (error จาก API โยนต่อให้ View แสดง) */
  async function openTable(tableId) {
    const session = await openTableApi(tableId)
    setTables((list) => list.map((t) => (t.id === tableId ? { ...t, session } : t)))
    return session
  }

  return { tables, loading, error, refresh, openTable }
}
