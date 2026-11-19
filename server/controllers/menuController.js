// Controller: รับ request → เรียก Model → ส่ง response (ไม่มี business logic ในนี้)
import * as Menu from '../models/menuModel.js'

export async function listCategories(_req, res) {
  res.json(await Menu.findCategories())
}

export async function listMenu(req, res) {
  res.json(await Menu.findAll({ categoryId: req.query.category, q: req.query.q }))
}

export async function getMenuItem(req, res) {
  res.json(await Menu.findById(req.params.id))
}

export async function createMenuItem(req, res) {
  res.status(201).json(await Menu.create(req.body ?? {}))
}

export async function updateMenuItem(req, res) {
  res.json(await Menu.updateById(req.params.id, req.body ?? {}))
}

export async function deleteMenuItem(req, res) {
  await Menu.remove(req.params.id)
  res.status(204).end()
}
