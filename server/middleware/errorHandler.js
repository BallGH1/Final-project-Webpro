import { HttpError } from '../utils/HttpError.js'

export function notFound(req, _res, next) {
  next(new HttpError(404, `ไม่พบ API: ${req.method} ${req.originalUrl}`))
}

// Express 5 ส่ง error จาก async controller มาที่นี่ให้อัตโนมัติ
export function errorHandler(err, _req, res, _next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'รูปแบบข้อมูล JSON ไม่ถูกต้อง' })
  }
  const status = err.status || 500
  if (status >= 500) console.error(err)
  res.status(status).json({
    message: status >= 500 ? 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' : err.message,
  })
}
