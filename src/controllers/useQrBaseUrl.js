// Controller: กำหนด URL หลักที่ใช้ใน QR Code (เริ่มจาก IP ของเครื่อง แก้ไขเองได้ เช่น ใส่ URL ของ tunnel)
import { useEffect, useState } from 'react'
import { defaultBaseUrl, getServerInfo, isValidBaseUrl } from '../models/tableModel'

export function useQrBaseUrl() {
  const [baseUrl, setBaseUrl] = useState(() => defaultBaseUrl())
  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    let active = true
    getServerInfo()
      .then(({ addresses: found }) => {
        if (!active) return
        setAddresses(found)
        setBaseUrl(defaultBaseUrl(found))
      })
      .catch(() => {}) // ดึง IP ไม่ได้ก็ยังใช้ URL ปัจจุบันหรือพิมพ์เองได้
    return () => {
      active = false
    }
  }, [])

  return { baseUrl, setBaseUrl, addresses, valid: isValidBaseUrl(baseUrl) }
}
