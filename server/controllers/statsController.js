// Controller: สถิติร้าน + ประวัติบิล (พนักงาน)
import * as Stats from '../models/statsModel.js'

export async function getStats(req, res) {
  res.json(await Stats.getStats(req.query.range))
}

export async function listBills(req, res) {
  res.json(await Stats.findClosedBills({ range: req.query.range, tableId: req.query.tableId }))
}
