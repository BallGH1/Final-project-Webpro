// Controller: บิล / รอบการนั่งของโต๊ะ
// - /tables/:id/open และ /sessions/:id/... ใช้ฝั่งพนักงาน
// - /s/:token/... ใช้ฝั่งลูกค้า (token มาจาก QR Code)
import * as Session from '../models/sessionModel.js'
import * as Order from '../models/orderModel.js'

export async function openTable(req, res) {
  res.status(201).json(await Session.open(req.params.id))
}

export async function getBill(req, res) {
  res.json(await Session.findBill(req.params.id))
}

export async function closeSession(req, res) {
  res.json(await Session.close(req.params.id))
}

export async function getByToken(req, res) {
  res.json(await Session.findByToken(req.params.token))
}

export async function listOrdersByToken(req, res) {
  res.json(await Session.findOrdersByToken(req.params.token))
}

export async function createOrderByToken(req, res) {
  const { items, note } = req.body ?? {}
  res.status(201).json(await Order.create({ token: req.params.token, items, note }))
}

export async function requestBill(req, res) {
  res.json(await Session.requestBill(req.params.token))
}
