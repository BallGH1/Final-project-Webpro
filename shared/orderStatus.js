// กฎสถานะออร์เดอร์ — ใช้ร่วมกันทั้ง Server และ Client เพื่อให้ทั้งสองฝั่งเห็นกฎชุดเดียวกัน

export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  SERVED: 'served',
  CANCELLED: 'cancelled',
}

export const STATUS_LABEL = {
  pending: 'รอรับออร์เดอร์',
  preparing: 'กำลังเตรียมอาหาร',
  served: 'เสิร์ฟแล้ว',
  cancelled: 'ยกเลิก',
}

// ข้อความบนปุ่มของพนักงาน เมื่อจะเปลี่ยนไปเป็นสถานะนั้น
export const STATUS_ACTION_LABEL = {
  preparing: 'รับออร์เดอร์',
  served: 'เสิร์ฟแล้ว',
  cancelled: 'ยกเลิก',
}

// สถานะถัดไปที่อนุญาต: รอรับออร์เดอร์ → กำลังเตรียมอาหาร → เสิร์ฟแล้ว
export const NEXT_STATUS = {
  pending: ['preparing', 'cancelled'],
  preparing: ['served'],
  served: [],
  cancelled: [],
}

// เหตุผลสำเร็จรูปตอนยกเลิกออร์เดอร์ (พนักงานพิมพ์เหตุผลอื่นเองได้)
export const CANCEL_REASONS = ['วัตถุดิบหมด', 'ลูกค้าขอยกเลิก', 'สั่งซ้ำ']
export const MAX_REASON_LENGTH = 100

export function isValidStatus(status) {
  return Object.hasOwn(STATUS_LABEL, status)
}

export function canChangeStatus(from, to) {
  return NEXT_STATUS[from]?.includes(to) ?? false
}
