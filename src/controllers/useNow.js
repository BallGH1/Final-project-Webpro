// Controller (UI): เวลาปัจจุบันที่อัปเดตเองทุก ๆ ช่วงเวลา (ใช้แสดง "นั่งมาแล้ว 45 นาที")
import { useEffect, useState } from 'react'

export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return now
}

/** แปลงระยะเวลาเป็นข้อความสั้น ๆ เช่น "8 นาที", "1 ชม. 5 นาที" */
export function formatDuration(fromIso, now) {
  const minutes = Math.max(0, Math.floor((now - new Date(fromIso).getTime()) / 60000))
  if (minutes < 60) return `${minutes} นาที`
  const hours = Math.floor(minutes / 60)
  return `${hours} ชม. ${minutes % 60} นาที`
}
