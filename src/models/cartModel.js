// Model: ตะกร้าสินค้า (pure functions — ใช้กับ useReducer)
// ตะกร้าเก็บแค่ในเครื่องลูกค้า ส่วนออร์เดอร์ที่ยืนยันแล้วจะถูกส่งไปเก็บที่ระบบกลาง
export const MAX_QTY = 20

const clampQty = (qty) => Math.min(MAX_QTY, qty)

export function cartReducer(items, action) {
  switch (action.type) {
    case 'add': {
      const { item, qty } = action
      const found = items.find((line) => line.menuId === item.id)
      if (found) {
        return items.map((line) =>
          line.menuId === item.id ? { ...line, qty: clampQty(line.qty + qty) } : line,
        )
      }
      return [
        ...items,
        { menuId: item.id, name: item.name, price: item.price, image: item.image, qty: clampQty(qty) },
      ]
    }
    case 'setQty':
      if (action.qty <= 0) return items.filter((line) => line.menuId !== action.menuId)
      return items.map((line) =>
        line.menuId === action.menuId ? { ...line, qty: clampQty(action.qty) } : line,
      )
    case 'remove':
      return items.filter((line) => line.menuId !== action.menuId)
    case 'clear':
      return []
    default:
      return items
  }
}

export const cartCount = (items) => items.reduce((sum, line) => sum + line.qty, 0)
export const cartTotal = (items) => items.reduce((sum, line) => sum + line.price * line.qty, 0)

/** แปลงตะกร้าเป็นรูปแบบที่ส่งให้ API (ส่งแค่ menuId + qty, Server คำนวณราคาเอง) */
export const toOrderItems = (items) => items.map(({ menuId, qty }) => ({ menuId, qty }))
