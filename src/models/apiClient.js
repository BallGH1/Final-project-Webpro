// ตัวกลางเรียก API ของระบบกลาง: จัดการ timeout และแปลง error ให้อ่านเข้าใจง่าย
const BASE_URL = '/api'
const TIMEOUT_MS = 10000

export async function request(path, { method = 'GET', body } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(BASE_URL + path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
    if (response.status === 204) return null

    const data = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(data?.message || `เกิดข้อผิดพลาด (HTTP ${response.status})`)
    }
    return data
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('เซิร์ฟเวอร์ตอบช้าเกินไป กรุณาลองใหม่', { cause: err })
    }
    if (err instanceof TypeError) throw new Error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', { cause: err })
    throw err
  } finally {
    clearTimeout(timer)
  }
}

/** สร้าง query string โดยตัดค่าที่ว่างทิ้ง เช่น { tableId: 'A05', status: '' } → "?tableId=A05" */
export function toQuery(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
  ).toString()
  return query ? `?${query}` : ''
}
