// Controller: ตะกร้าของบิล — ใช้ useReducer + เก็บใน localStorage แยกตาม token (รีเฟรชแล้วไม่หาย)
// token เปลี่ยนทุกครั้งที่เปิดโต๊ะใหม่ ลูกค้ารอบถัดไปจึงได้ตะกร้าว่างเสมอ
import { useEffect, useMemo, useReducer } from 'react'
import { CartContext } from './CartContext'
import { cartCount, cartReducer, cartTotal } from '../../models/cartModel'
import { readStorage, writeStorage } from '../../models/storage'
import { customerPath } from '../../models/sessionModel'

export function CartProvider({ token, tableId, children }) {
  const storageKey = `suki-cart-${token}`
  const [items, dispatch] = useReducer(cartReducer, storageKey, (key) => readStorage(key, []))

  useEffect(() => {
    writeStorage(storageKey, items)
  }, [storageKey, items])

  const value = useMemo(
    () => ({
      token,
      tableId,
      basePath: customerPath(token),
      items,
      count: cartCount(items),
      total: cartTotal(items),
      addItem: (item, qty = 1) => dispatch({ type: 'add', item, qty }),
      setQty: (menuId, qty) => dispatch({ type: 'setQty', menuId, qty }),
      removeItem: (menuId) => dispatch({ type: 'remove', menuId }),
      clearCart: () => dispatch({ type: 'clear' }),
    }),
    [token, tableId, items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
