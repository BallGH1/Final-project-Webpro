// Controller: ดึงข้อมูลจาก API แล้วดึงใหม่ทุก ๆ ช่วงเวลา (ใช้กับหน้าสถิติ/ประวัติบิล)
// เปลี่ยน key (เช่น ช่วงเวลา) → ดึงใหม่ทันที โดยข้อมูลเก่ายังแสดงอยู่ระหว่างรอ (หน้าไม่กระพริบ)
import { useCallback, useEffect, useState } from 'react'

export function usePolling(fetcher, key, intervalMs = 30000) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    function load() {
      fetcher()
        .then((result) => {
          if (!active) return
          setData(result)
          setError('')
        })
        .catch((err) => active && setError(err.message))
        .finally(() => active && setLoading(false))
    }
    load()
    const timer = setInterval(load, intervalMs)
    return () => {
      active = false
      clearInterval(timer)
    }
    // fetcher สร้างใหม่ทุก render จึงใช้ key เป็นตัวบอกว่าต้องดึงใหม่
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, intervalMs, refreshKey])

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])
  return { data, loading, error, refresh }
}
