# 🍲 Suki Teeyai — ระบบจัดการออร์เดอร์ร้านสุกี้

พนักงานเปิดโต๊ะ (ได้ QR ใหม่) → ลูกค้าสแกน QR → เลือกเมนู → ยืนยันออร์เดอร์ → พนักงานเห็นออร์เดอร์ใหม่อัตโนมัติ → เปลี่ยนสถานะ → ลูกค้าเห็นสถานะของตัวเอง → ลูกค้าขอเช็กบิล → พนักงานรับชำระและปิดโต๊ะ

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
| `/` | วิธีใช้งาน / เข้าหน้าพนักงาน | ทุกคน |
| `/t/:token` | เมนูอาหาร + ค้นหา + กรองหมวด | ลูกค้า |
| `/t/:token/cart` | ตะกร้า + ยืนยันการสั่ง | ลูกค้า |
| `/t/:token/orders` | สถานะออร์เดอร์ของบิลนี้ + ยอดรวม + ปุ่มเช็กบิล | ลูกค้า |
| `/staff` | Dashboard ออร์เดอร์ + เปลี่ยนสถานะ + แจ้งเตือนโต๊ะขอเช็กบิล | พนักงาน |
| `/staff/menu` | จัดการเมนู (เพิ่ม/แก้ไข/ลบ/เปิด-ปิดขาย) | พนักงาน |
| `/staff/tables` | ผังร้าน (ลาก/ซูมได้) หรือรายการโต๊ะ + เปิดโต๊ะ + กล่องคำพูดเมื่อขอเช็กบิล/เรียกพนักงาน | พนักงาน |
| `/staff/history` | ประวัติบิลที่ชำระแล้ว กรองตามช่วงเวลา/โต๊ะ | พนักงาน |
| `/staff/dashboard` | สถิติ: ยอดขาย บิล ออร์เดอร์ เวลาเสิร์ฟ กราฟรายชั่วโมง/รายวัน เมนูขายดี ยอดตามหมวด | พนักงาน |
| `/staff/tables/bill/:sessionId` | บิลรวมของโต๊ะ + ชำระแล้ว / ปิดโต๊ะ | พนักงาน |

## บิลและ QR Code (เปิดโต๊ะ 1 ครั้ง = บิล 1 ใบ = QR 1 ชุด)

- QR ไม่ได้ผูกกับเลขโต๊ะตายตัว แต่ผูกกับ **บิล** — ทุกครั้งที่เปิดโต๊ะ ระบบสุ่ม token ใหม่ (`node:crypto`) ใส่ใน URL เช่น `/t/k8f3x2Qa`
- ลูกค้าสั่งอาหารได้ผ่าน token เท่านั้น พิมพ์ `/table/A05` เองเพื่อสั่งเข้าโต๊ะคนอื่นไม่ได้
- ลูกค้าเห็นเฉพาะออร์เดอร์ของบิลตัวเอง ลูกค้ารอบถัดไปจึงไม่เห็นออร์เดอร์ของรอบก่อน
- สถานะบิล: `open` มีลูกค้า → `billing` ขอเช็กบิล (สั่งเพิ่มไม่ได้) → `closed` ชำระแล้ว (QR ใช้ไม่ได้อีก)
- ปิดโต๊ะไม่ได้ถ้ายังมีออร์เดอร์ที่ยังไม่เสิร์ฟ (`pending` / `preparing`)

## แจ้งเตือนลูกค้าแบบ Real-time (ไม่ใช้ WebSocket)

- หน้าลูกค้าดึงออร์เดอร์ทุก 3 วินาที (polling) แล้ว `useOrderAlerts` เทียบสถานะกับรอบก่อน ถ้าเปลี่ยนจะแจ้งเตือนทันทีไม่ว่าลูกค้าอยู่หน้าไหน
- ถูกยกเลิก → popup กลางจอพร้อม **เหตุผล** (ต้องกดรับทราบ) · ครัวรับ/เสิร์ฟแล้ว → toast หายเองใน 4 วินาที
- มีเสียง (Web Audio API) และสั่น (`navigator.vibrate`) — ทั้งหมดมากับ browser ไม่ต้องลงไลบรารีเพิ่ม
- พนักงานต้องเลือก/พิมพ์เหตุผลทุกครั้งที่ยกเลิก (Server ตรวจซ้ำ ไม่มีเหตุผลจะยกเลิกไม่ได้)

## ใช้ QR Code สั่งอาหารจากโทรศัพท์

1. รัน `npm run dev` บนคอม แล้วเปิด http://localhost:5173/staff/tables (ระบบใส่ IP ของเครื่องใน QR ให้อัตโนมัติ) แล้วกด **เปิดโต๊ะ**
2. โทรศัพท์ต้องต่อ **Wi-Fi วงเดียวกับคอม** แล้วสแกน QR ที่ขึ้นมา (เดโมบนคอมเครื่องเดียว กดปุ่ม "หน้าลูกค้า" แทนได้)
3. ถ้าเข้าไม่ได้: อนุญาต Node.js ผ่าน Windows Firewall (Private networks) หรือ Wi-Fi อาจบล็อกอุปกรณ์คุยกัน ให้ลองเปิด hotspot จากโทรศัพท์
4. ต้องการให้คนนอกเครือข่ายสแกนได้ (เช่น นำเสนอออนไลน์): ใช้ tunnel (Cloudflare Tunnel / ngrok) แล้ววาง URL ที่ได้ลงช่อง "URL ของเว็บ" บนหน้า QR

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
shared/sessionStatus.js     ← กฎสถานะบิล (open / billing / closed)

src/                        ← หน้าเว็บ (React + Vite + Tailwind)
├── models/          [M]    เรียก API + ฟังก์ชันจัดการข้อมูล (ไม่มี React)
├── controllers/     [C]    Custom Hooks + Context: จัดการ state และเชื่อม Model กับ View
└── views/           [V]    แสดงผลอย่างเดียว
    ├── layouts/              CustomerLayout, StaffLayout
    ├── pages/                หน้าเว็บแต่ละหน้า
    └── components/           Component ย่อยที่ใช้ซ้ำ
```

**ลำดับการทำงาน (ตัวอย่าง: ยืนยันการสั่งอาหาร)**
`CartPage` (View) → `usePlaceOrder` (Controller) → `sessionModel.createSessionOrder` (Model) → `POST /api/s/:token/orders` → `sessionController` → `orderModel.create` (ตรวจ token + คำนวณราคาจากเมนูจริง) → `db.json`

## API

| Method | Path | ใช้ทำอะไร |
|---|---|---|
| GET | `/api/categories` | หมวดหมู่ |
| GET | `/api/menu?category=&q=` | รายการเมนู |
| POST / PUT / DELETE | `/api/menu`, `/api/menu/:id` | จัดการเมนู |
| GET | `/api/tables`, `/api/tables/:id` | ข้อมูลโต๊ะ + บิลที่เปิดอยู่ (`session`) |
| POST | `/api/tables/:id/open` | เปิดโต๊ะ → บิลใหม่พร้อม token |
| GET | `/api/sessions/:id/bill` | บิลรวม (รวมเมนูเดียวกัน ไม่นับออร์เดอร์ที่ยกเลิก) |
| POST | `/api/sessions/:id/close` | ชำระแล้ว / ปิดโต๊ะ |
| GET | `/api/s/:token` | ลูกค้า: ข้อมูลบิลจาก token |
| GET | `/api/s/:token/orders` | ลูกค้า: ออร์เดอร์ของบิลนี้ |
| POST | `/api/s/:token/orders` | ลูกค้า: สร้างออร์เดอร์ `{ items: [{ menuId, qty }], note }` |
| POST | `/api/s/:token/request-bill` | ลูกค้า: ขอเช็กบิล |
| POST | `/api/s/:token/call-staff` | ลูกค้า: เรียกพนักงาน `{ reason }` |
| POST | `/api/sessions/:id/ack-call` | พนักงาน: รับทราบการเรียก |
| GET | `/api/stats?range=today\|7d\|30d` | สถิติร้าน (คิดตามเวลาไทย) |
| GET | `/api/bills?range=&tableId=` | ประวัติบิลที่ชำระแล้ว |
| GET | `/api/server-info` | IP ของเครื่อง server (ใช้สร้าง URL ใน QR) |
| GET | `/api/orders?tableId=&status=` | รายการออร์เดอร์ (พนักงาน) |
| PATCH | `/api/orders/:id/status` | เปลี่ยนสถานะ `{ status, reason }` (`reason` จำเป็นเมื่อยกเลิก) |

สถานะ: `pending` รอรับออร์เดอร์ → `preparing` กำลังเตรียมอาหาร → `served` เสิร์ฟแล้ว (ยกเลิกได้เฉพาะตอน `pending`)

## เทคโนโลยี

React 19 · React Router 7 · Tailwind CSS 4 · Vite · Express 5 · ESLint
Hooks ที่ใช้: `useState`, `useEffect`, `useReducer` (ตะกร้า), `useContext` (CartContext), `useMemo`, `useCallback` และ Custom Hooks
