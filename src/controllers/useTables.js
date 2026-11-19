// Controller: ข้อมูลโต๊ะ
import { useEffect, useState } from 'react'
import { getTable, getTables } from '../models/tableModel'

/** ตรวจว่าโต๊ะจาก URL (/table/:tableId) มีอยู่จริง */
export function useTable(tableId) {
  const [state, setState] = useState({ table: null, loading: true, error: '' })

  useEffect(() => {
    let active = true
    getTable(tableId)
      .then((table) => active && setState({ table, loading: false, error: '' }))
      .catch((err) => active && setState({ table: null, loading: false, error: err.message }))
    return () => {
      active = false
    }
  }, [tableId])

  return state
}

export function useTables() {
  const [state, setState] = useState({ tables: [], loading: true, error: '' })

  useEffect(() => {
    let active = true
    getTables()
      .then((tables) => active && setState({ tables, loading: false, error: '' }))
      .catch((err) => active && setState({ tables: [], loading: false, error: err.message }))
    return () => {
      active = false
    }
  }, [])

  return state
}
