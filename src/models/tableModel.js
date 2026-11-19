// Model: โต๊ะ
import { request } from './apiClient'
import { customerPath } from './sessionModel'

/** รายการโต๊ะ พร้อมบิลที่เปิดอยู่ (table.session เป็น null ถ้าโต๊ะว่าง) */
export const getTables = () => request('/tables')
export const openTable = (id) => request(`/tables/${encodeURIComponent(id)}/open`, { method: 'POST' })
export const getServerInfo = () => request('/server-info')

const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]']

/**
 * URL ตั้งต้นสำหรับ QR Code
 * ถ้าเปิดหน้านี้ผ่าน localhost โทรศัพท์จะเข้าไม่ได้ จึงเปลี่ยนเป็น IP ของเครื่องในวง LAN แทน
 */
export function defaultBaseUrl(addresses = []) {
  const { protocol, hostname, port, origin } = window.location
  if (LOCAL_HOSTS.includes(hostname) && addresses.length > 0) {
    return `${protocol}//${addresses[0]}${port ? `:${port}` : ''}`
  }
  return origin
}

/** URL ที่ลูกค้าเปิดเมื่อสแกน QR Code ของบิล (เปลี่ยนทุกครั้งที่เปิดโต๊ะใหม่) */
export const sessionUrl = (baseUrl, token) => `${baseUrl.trim().replace(/\/+$/, '')}${customerPath(token)}`

/** ตรวจว่าเป็น URL แบบ http(s) ที่ใช้ได้ */
export function isValidBaseUrl(value) {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
