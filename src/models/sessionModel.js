// Model: บิล (รอบการนั่งของโต๊ะ) — ลูกค้าใช้ token จาก QR, พนักงานใช้ id ของบิล
import { request } from './apiClient'

export {
  SESSION_STATUS,
  SESSION_LABEL,
  canOrder,
  isActiveSession,
  CALL_REASONS,
} from '../../shared/sessionStatus.js'

const byToken = (token) => `/s/${encodeURIComponent(token)}`

// ฝั่งลูกค้า
export const getSession = (token) => request(byToken(token))
export const getSessionOrders = (token) => request(`${byToken(token)}/orders`)
export const createSessionOrder = (token, { items, note }) =>
  request(`${byToken(token)}/orders`, { method: 'POST', body: { items, note } })
export const requestBill = (token) => request(`${byToken(token)}/request-bill`, { method: 'POST' })
export const callStaff = (token, reason) =>
  request(`${byToken(token)}/call-staff`, { method: 'POST', body: { reason } })

// ฝั่งพนักงาน
export const getBill = (id) => request(`/sessions/${id}/bill`)
export const closeSession = (id) => request(`/sessions/${id}/close`, { method: 'POST' })
export const acknowledgeCall = (id) => request(`/sessions/${id}/ack-call`, { method: 'POST' })

/** path ของหน้าลูกค้า เช่น /t/k8f3x2Qa */
export const customerPath = (token) => `/t/${token}`
