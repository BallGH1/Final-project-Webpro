// Routes: จับคู่ URL + HTTP method กับ Controller
import { Router } from 'express'
import * as menu from '../controllers/menuController.js'
import * as table from '../controllers/tableController.js'
import * as order from '../controllers/orderController.js'
import * as session from '../controllers/sessionController.js'
import * as stats from '../controllers/statsController.js'
import { getServerInfo } from '../controllers/serverController.js'

const router = Router()

router.get('/health', (_req, res) => res.json({ ok: true }))
router.get('/server-info', getServerInfo)

router.get('/categories', menu.listCategories)

router.get('/menu', menu.listMenu)
router.get('/menu/:id', menu.getMenuItem)
router.post('/menu', menu.createMenuItem)
router.put('/menu/:id', menu.updateMenuItem)
router.delete('/menu/:id', menu.deleteMenuItem)

router.get('/tables', table.listTables)
router.get('/tables/:id', table.getTable)
router.post('/tables/:id/open', session.openTable)

// บิล (พนักงาน)
router.get('/sessions/:id/bill', session.getBill)
router.post('/sessions/:id/close', session.closeSession)
router.post('/sessions/:id/ack-call', session.acknowledgeCall)

// ลูกค้า: ทุกอย่างผ่าน token ใน QR — สั่งอาหารด้วยเลขโต๊ะตรง ๆ ไม่ได้
router.get('/s/:token', session.getByToken)
router.get('/s/:token/orders', session.listOrdersByToken)
router.post('/s/:token/orders', session.createOrderByToken)
router.post('/s/:token/request-bill', session.requestBill)
router.post('/s/:token/call-staff', session.callStaff)

// สถิติ + ประวัติบิล (พนักงาน)
router.get('/stats', stats.getStats)
router.get('/bills', stats.listBills)

// ออร์เดอร์ (พนักงาน)
router.get('/orders', order.listOrders)
router.get('/orders/:id', order.getOrder)
router.patch('/orders/:id/status', order.updateOrderStatus)

export default router
