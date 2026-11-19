// Controller: บิลของลูกค้าจาก token ใน URL (/t/:token)
// ดึงใหม่ทุก POLL_INTERVAL เพื่อให้หน้าลูกค้ารู้ทันทีเมื่อพนักงานปิดโต๊ะ
import { useCallback, useEffect, useState } from 'react'
import { callStaff as callStaffApi, getSession, requestBill as requestBillApi } from '../models/sessionModel'
import { POLL_INTERVAL } from '../models/orderModel'

export function useSession(token) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true

    function load() {
      getSession(token)
        .then((data) => {
          if (!active) return
          setSession(data)
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
  }, [token, refreshKey])

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), [])

  async function requestBill() {
    const updated = await requestBillApi(token)
    setSession(updated)
    return updated
  }

  async function callStaff(reason) {
    const updated = await callStaffApi(token, reason)
    setSession(updated)
    return updated
  }

  return { session, loading, error, refresh, requestBill, callStaff }
}
