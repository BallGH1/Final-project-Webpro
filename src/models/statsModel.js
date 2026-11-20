// Model: สถิติร้าน + ประวัติบิล (เรียก API)
import { request, toQuery } from './apiClient'

export const RANGES = [
  { id: 'today', label: 'วันนี้', compare: 'เมื่อวาน' },
  { id: '7d', label: '7 วัน', compare: '7 วันก่อนหน้า' },
  { id: '30d', label: '30 วัน', compare: '30 วันก่อนหน้า' },
]

export const getStats = (range) => request(`/stats${toQuery({ range })}`)
export const getBills = ({ range, tableId } = {}) => request(`/bills${toQuery({ range, tableId })}`)

/** % เปลี่ยนแปลงจากช่วงก่อนหน้า (null = เทียบไม่ได้ เพราะช่วงก่อนเป็น 0) */
export function percentChange(current, previous) {
  if (!previous) return null
  return ((current - previous) / previous) * 100
}
