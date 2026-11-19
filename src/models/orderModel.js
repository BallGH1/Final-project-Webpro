// Model: ออร์เดอร์ (เรียก API + กฎสถานะที่ใช้ร่วมกับ Server)
import { request, toQuery } from './apiClient'

export {
  ORDER_STATUS,
  STATUS_LABEL,
  STATUS_ACTION_LABEL,
  NEXT_STATUS,
} from '../../shared/orderStatus.js'

// ดึงออร์เดอร์ใหม่ทุก ๆ กี่มิลลิวินาที (จำลอง Real-time ด้วย polling)
export const POLL_INTERVAL = 3000

export const getOrders = ({ tableId, status } = {}) =>
  request(`/orders${toQuery({ tableId, status })}`)

export const getOrder = (id) => request(`/orders/${id}`)

export const createOrder = ({ tableId, items, note }) =>
  request('/orders', { method: 'POST', body: { tableId, items, note } })

export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}/status`, { method: 'PATCH', body: { status } })
