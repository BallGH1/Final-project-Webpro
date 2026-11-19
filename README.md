# 🍲 Suki Order — ระบบจัดการออร์เดอร์ร้านสุกี้

ลูกค้าสแกน QR ที่โต๊ะ → เลือกเมนู → ยืนยันออร์เดอร์ → พนักงานเห็นออร์เดอร์ใหม่อัตโนมัติ → เปลี่ยนสถานะ → ลูกค้าเห็นสถานะของตัวเอง

ออร์เดอร์ทุกรายการถูกบันทึกที่ **ระบบกลาง (Express server + `db.json`)** ไม่ได้อยู่แค่ใน React State ของเครื่องลูกค้า หน้าลูกค้าและหน้าพนักงานจึงเห็นข้อมูลชุดเดียวกัน

## วิธีรัน

```bash
npm install
npm run dev        # รัน API (port 3001) + หน้าเว็บ (port 5173) พร้อมกัน
```

- หน้าเว็บ: http://localhost:5173
- ทดสอบจากมือถือ (Wi-Fi เดียวกัน): ใช้ URL `Network:` ที่ Vite แสดงใน terminal
- `npm run lint` ตรวจโค้ด · `npm start` build แล้วรันแบบ production ที่ port 3001
- `npm run reset-db` คืนข้อมูลตั้งต้น (ปิด server ก่อน)

## หน้าเว็บ (Routes)

| URL | หน้า | ผู้ใช้ |
|---|---|---|
| `/` | เลือกโต๊ะ (แทนการสแกน QR) / เข้าหน้าพนักงาน | ทุกคน |
| `/table/:tableId` | เมนูอาหาร + ค้นหา + กรองหมวด | ลูกค้า |
| `/table/:tableId/cart` | ตะกร้า + ยืนยันการสั่ง | ลูกค้า |
| `/table/:tableId/orders` | สถานะออร์เดอร์ของโต๊ะ | ลูกค้า |
| `/staff` | Dashboard ออร์เดอร์ + เปลี่ยนสถานะ | พนักงาน |
| `/staff/menu` | จัดการเมนู (เพิ่ม/แก้ไข/ลบ/เปิด-ปิดขาย) | พนักงาน |

## โครงสร้างแบบ MVC

```
server/                     ← ระบบกลาง (Node.js + Express)
├── index.js                  จุดเริ่ม server
├── routes/index.js           URL → Controller
├── controllers/              รับ request → เรียก Model → ส่ง response
├── models/                   ข้อมูล + กฎทางธุรกิจ (ตรวจข้อมูล, คำนวณราคา, กฎสถานะ)
│   └── db.js                 อ่าน/เขียน data/db.json (มีคิวกันเขียนชนกัน)
├── middleware/errorHandler.js
└── data/db.seed.json         ข้อมูลตั้งต้น (db.json สร้างอัตโนมัติ)

shared/orderStatus.js       ← กฎสถานะออร์เดอร์ ใช้ร่วมกันทั้ง server และ client

src/                        ← หน้าเว็บ (React + Vite + Tailwind)
├── models/          [M]    เรียก API + ฟังก์ชันจัดการข้อมูล (ไม่มี React)
├── controllers/     [C]    Custom Hooks + Context: จัดการ state และเชื่อม Model กับ View
└── views/           [V]    แสดงผลอย่างเดียว
    ├── layouts/              CustomerLayout, StaffLayout
    ├── pages/                หน้าเว็บแต่ละหน้า
    └── components/           Component ย่อยที่ใช้ซ้ำ
```

**ลำดับการทำงาน (ตัวอย่าง: ยืนยันการสั่งอาหาร)**
`CartPage` (View) → `usePlaceOrder` (Controller) → `orderModel.createOrder` (Model) → `POST /api/orders` → `orderController` → `orderModel.create` (คำนวณราคาจากเมนูจริง) → `db.json`

## API

| Method | Path | ใช้ทำอะไร |
|---|---|---|
| GET | `/api/categories` | หมวดหมู่ |
| GET | `/api/menu?category=&q=` | รายการเมนู |
| POST / PUT / DELETE | `/api/menu`, `/api/menu/:id` | จัดการเมนู |
| GET | `/api/tables`, `/api/tables/:id` | ข้อมูลโต๊ะ |
| GET | `/api/orders?tableId=&status=` | รายการออร์เดอร์ |
| POST | `/api/orders` | สร้างออร์เดอร์ `{ tableId, items: [{ menuId, qty }], note }` |
| PATCH | `/api/orders/:id/status` | เปลี่ยนสถานะ `{ status }` |

สถานะ: `pending` รอรับออร์เดอร์ → `preparing` กำลังเตรียมอาหาร → `served` เสิร์ฟแล้ว (ยกเลิกได้เฉพาะตอน `pending`)

## เทคโนโลยี

React 19 · React Router 7 · Tailwind CSS 4 · Vite · Express 5 · ESLint
Hooks ที่ใช้: `useState`, `useEffect`, `useReducer` (ตะกร้า), `useContext` (CartContext), `useMemo`, `useCallback` และ Custom Hooks
