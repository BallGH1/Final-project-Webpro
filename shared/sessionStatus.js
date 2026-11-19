// กฎสถานะบิล (รอบการนั่งของโต๊ะ) — ใช้ร่วมกันทั้ง Server และ Client
// เปิดโต๊ะ 1 ครั้ง = บิล 1 ใบ = QR (token) 1 ชุด

export const SESSION_STATUS = {
  OPEN: 'open',
  BILLING: 'billing',
  CLOSED: 'closed',
}

export const SESSION_LABEL = {
  open: 'มีลูกค้า',
  billing: 'ขอเช็กบิล',
  closed: 'ชำระแล้ว',
}

/** บิลที่ยังไม่ปิด (โต๊ะยังมีลูกค้านั่งอยู่) */
export function isActiveSession(status) {
  return status === SESSION_STATUS.OPEN || status === SESSION_STATUS.BILLING
}

/** สั่งอาหารเพิ่มได้เฉพาะตอนที่ยังไม่ขอเช็กบิล */
export function canOrder(status) {
  return status === SESSION_STATUS.OPEN
}
