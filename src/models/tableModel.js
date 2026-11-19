// Model: โต๊ะ
import { request } from './apiClient'

export const getTables = () => request('/tables')
export const getTable = (id) => request(`/tables/${encodeURIComponent(id)}`)

/** URL ที่ลูกค้าเปิดเมื่อสแกน QR Code ของโต๊ะ */
export const tableUrl = (id) => `${window.location.origin}/table/${id}`
