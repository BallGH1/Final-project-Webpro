// Model: ออร์เดอร์ (เรียก API + กฎสถานะที่ใช้ร่วมกับ Server)
import { request, toQuery } from './apiClient'

export {
  ORDER_STATUS,
  STATUS_LABEL,
  STATUS_ACTION_LABEL,
  NEXT_STATUS,
  CANCEL_REASONS,
  MAX_REASON_LENGTH,
} from '../../shared/orderStatus.js'

// ดึงออร์เดอร์ใหม่ทุก ๆ กี่มิลลิวินาที (จำลอง Real-time ด้วย polling)
export const POLL_INTERVAL = 3000

export const getOrders = ({ tableId, status } = {}) =>
  request(`/orders${toQuery({ tableId, status })}`)

export const getOrder = (id) => request(`/orders/${id}`)

// การสร้างออร์เดอร์ของลูกค้าอยู่ใน sessionModel (สั่งผ่าน token ของบิลเท่านั้น)

/** `reason` จำเป็นเมื่อยกเลิก (status = 'cancelled') */
export const updateOrderStatus = (id, status, reason) =>
  request(`/orders/${id}/status`, { method: 'PATCH', body: { status, reason } })
