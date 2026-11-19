// npm run reset-db — คืนฐานข้อมูลเป็นข้อมูลตั้งต้น (ปิด server ก่อนรัน)
import { copyFile } from 'node:fs/promises'
import { DB_PATH, SEED_PATH } from '../models/db.js'

await copyFile(SEED_PATH, DB_PATH)
console.log('รีเซ็ต data/db.json เป็นข้อมูลตั้งต้นแล้ว')
