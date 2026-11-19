// ระบบกลาง (Central Server): ลูกค้าทุกโต๊ะและพนักงานอ่าน/เขียนออร์เดอร์ผ่าน API ชุดนี้
import express from 'express'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import apiRouter from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const PORT = Number(process.env.PORT) || 3001
const distDir = fileURLToPath(new URL('../dist', import.meta.url))

const app = express()
app.use(express.json({ limit: '100kb' }))

app.use('/api', apiRouter)
app.use('/api', notFound)

// โหมด production (npm start): เสิร์ฟหน้าเว็บที่ build แล้วจาก dist/
if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next()
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`API server พร้อมใช้งานที่ http://localhost:${PORT}/api`)
})
