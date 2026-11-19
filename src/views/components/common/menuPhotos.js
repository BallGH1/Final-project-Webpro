// รูปอาหารของเมนูตั้งต้น (ไฟล์อยู่ใน public/menu/ — เครดิตรูปดูที่ public/menu/CREDITS.md)
// จับคู่ด้วยชื่อเมนู จึงไม่ต้องแก้ข้อมูลใน server — เมนูที่ยังไม่มีรูปจะแสดงไอคอนแทน
const PHOTO_FILES = {
  หมูสไลด์: '1.jpg',
  หมูหมักงา: '2.jpg',
  สามชั้นสไลด์: '3.jpg',
  เนื้อวัวสไลด์: '4.jpg',
  เนื้อลายหินอ่อน: '5.jpg',
  กุ้งสด: '6.jpg',
  หมึกกล้วย: '7.jpg',
  ผักรวม: '8.jpg',
  เห็ดรวม: '9.jpg',
  ข้าวโพดอ่อน: '10.jpg',
  ลูกชิ้นปลา: '11.jpg',
  ลูกชิ้นกุ้ง: '12.jpg',
  เต้าหู้ปลา: '13.jpg',
  น้ำเปล่า: '14.jpg',
  ชาเขียวเย็น: '15.jpg',
  น้ำอัดลม: '16.jpg',
}

/** คืน URL รูปของเมนู หรือ null ถ้าเมนูนี้ยังไม่มีรูป */
export function menuPhotoUrl(name) {
  const file = PHOTO_FILES[String(name ?? '').trim()]
  return file ? `${import.meta.env.BASE_URL}menu/${file}` : null
}
