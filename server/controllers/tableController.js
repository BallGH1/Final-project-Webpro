import * as Table from '../models/tableModel.js'

export async function listTables(_req, res) {
  res.json(await Table.findAll())
}

export async function getTable(req, res) {
  res.json(await Table.findById(req.params.id))
}
