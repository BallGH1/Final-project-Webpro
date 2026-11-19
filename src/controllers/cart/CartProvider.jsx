// Controller: ตะกร้าของโต๊ะ — ใช้ useReducer + เก็บใน localStorage แยกตามโต๊ะ (รีเฟรชแล้วไม่หาย)
import { useEffect, useMemo, useReducer } from 'react'
import { CartContext } from './CartContext'
import { cartCount, cartReducer, cartTotal } from '../../models/cartModel'
import { readStorage, writeStorage } from '../../models/storage'

export function CartProvider({ tableId, children }) {
  const storageKey = `suki-cart-${tableId}`
  const [items, dispatch] = useReducer(cartReducer, storageKey, (key) => readStorage(key, []))

  useEffect(() => {
    writeStorage(storageKey, items)
  }, [storageKey, items])

  const value = useMemo(
    () => ({
      tableId,
      items,
      count: cartCount(items),
      total: cartTotal(items),
      addItem: (item, qty = 1) => dispatch({ type: 'add', item, qty }),
      setQty: (menuId, qty) => dispatch({ type: 'setQty', menuId, qty }),
      removeItem: (menuId) => dispatch({ type: 'remove', menuId }),
      clearCart: () => dispatch({ type: 'clear' }),
    }),
    [tableId, items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
