// Controller: ข้อมูลเครื่อง server — ใช้สร้าง URL ใน QR Code ให้โทรศัพท์ในวง Wi-Fi เดียวกันเข้าถึงได้
import os from 'node:os'

export function getServerInfo(_req, res) {
  const addresses = Object.values(os.networkInterfaces())
    .flat()
    .filter((net) => net && net.family === 'IPv4' && !net.internal)
    .map((net) => net.address)
  res.json({ addresses })
}
