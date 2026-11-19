// Controller: โหลดเมนู + หมวดหมู่ และจัดการสถานะค้นหา/กรอง
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ALL_CATEGORIES, filterMenu, getCategories, getMenu } from '../models/menuModel'

export function useMenu() {
  const [menu, setMenu] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    Promise.all([getMenu(), getCategories()])
      .then(([menuData, categoryData]) => {
        if (!active) return
        setMenu(menuData)
        setCategories(categoryData)
        setError('')
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const reload = useCallback(() => {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }, [])

  return { menu, setMenu, categories, loading, error, reload }
}

export function useMenuFilter(menu) {
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState(ALL_CATEGORIES)
  const filtered = useMemo(() => filterMenu(menu, { query, categoryId }), [menu, query, categoryId])
  return { query, setQuery, categoryId, setCategoryId, filtered }
}
