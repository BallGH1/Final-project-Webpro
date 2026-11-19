// Model: โต๊ะ
import { request } from './apiClient'

export const getTables = () => request('/tables')
export const getTable = (id) => request(`/tables/${encodeURIComponent(id)}`)
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

/** URL ที่ลูกค้าเปิดเมื่อสแกน QR Code ของโต๊ะ */
export const tableUrl = (baseUrl, id) => `${baseUrl.trim().replace(/\/+$/, '')}/table/${id}`

/** ตรวจว่าเป็น URL แบบ http(s) ที่ใช้ได้ */
export function isValidBaseUrl(value) {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
