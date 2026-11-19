// Routes: จับคู่ URL + HTTP method กับ Controller
import { Router } from 'express'
import * as menu from '../controllers/menuController.js'
import * as table from '../controllers/tableController.js'
import * as order from '../controllers/orderController.js'

const router = Router()

router.get('/health', (_req, res) => res.json({ ok: true }))

router.get('/categories', menu.listCategories)

router.get('/menu', menu.listMenu)
router.get('/menu/:id', menu.getMenuItem)
router.post('/menu', menu.createMenuItem)
router.put('/menu/:id', menu.updateMenuItem)
router.delete('/menu/:id', menu.deleteMenuItem)

router.get('/tables', table.listTables)
router.get('/tables/:id', table.getTable)

router.get('/orders', order.listOrders)
router.get('/orders/:id', order.getOrder)
router.post('/orders', order.createOrder)
router.patch('/orders/:id/status', order.updateOrderStatus)

export default router
