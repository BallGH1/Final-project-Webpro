// ชั้นจัดเก็บข้อมูลกลาง: อ่าน/เขียนไฟล์ data/db.json
// - โหลดไฟล์เข้าหน่วยความจำครั้งเดียว แล้วอ่านจากหน่วยความจำ
// - การเขียนเข้าคิวทีละงาน ป้องกันออร์เดอร์ 2 รายการที่ส่งพร้อมกันเขียนทับกัน
import { access, copyFile, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export const DB_PATH = fileURLToPath(new URL('../data/db.json', import.meta.url))
export const SEED_PATH = fileURLToPath(new URL('../data/db.seed.json', import.meta.url))

let loading = null
let writeQueue = Promise.resolve()

async function init() {
  try {
    await access(DB_PATH)
  } catch {
    await copyFile(SEED_PATH, DB_PATH)
    console.log('[db] สร้าง data/db.json จาก db.seed.json')
  }
  const db = JSON.parse(await readFile(DB_PATH, 'utf8'))
  // db.json ที่สร้างก่อนมีระบบบิล จะยังไม่มี collection นี้
  db.sessions ??= []
  return db
}

function load() {
  loading ??= init()
  return loading
}

/** อ่านข้อมูลทั้ง collection (คืนค่าเป็นสำเนา แก้ไขแล้วไม่กระทบข้อมูลจริง) */
export async function getAll(collection) {
  const db = await load()
  return structuredClone(db[collection])
}

/**
 * แก้ไขข้อมูลแล้วบันทึกลงไฟล์
 * @param {(db: object) => any} mutator ฟังก์ชันที่แก้ db ได้โดยตรง และคืนค่าผลลัพธ์
 */
export function update(mutator) {
  const task = writeQueue.then(async () => {
    const db = await load()
    const result = mutator(db)
    await writeFile(DB_PATH, JSON.stringify(db, null, 2))
    return structuredClone(result)
  })
  writeQueue = task.catch(() => {})
  return task
}

export function nextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1
}
