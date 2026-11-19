import * as Order from '../models/orderModel.js'

export async function listOrders(req, res) {
  res.json(await Order.findAll({ tableId: req.query.tableId, status: req.query.status }))
}

export async function getOrder(req, res) {
  res.json(await Order.findById(req.params.id))
}

export async function updateOrderStatus(req, res) {
  res.json(await Order.updateStatus(req.params.id, req.body?.status, req.body?.reason))
}
