// Controller: ยืนยันการสั่งอาหาร — ส่งตะกร้าไประบบกลางผ่าน token ของบิล แล้วล้างตะกร้า
import { useState } from 'react'
import { useCart } from './cart/useCart'
import { createSessionOrder } from '../models/sessionModel'
import { toOrderItems } from '../models/cartModel'

export function usePlaceOrder() {
  const { token, items, clearCart } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function placeOrder(note = '') {
    if (items.length === 0) return null
    setSubmitting(true)
    setError('')
    try {
      const order = await createSessionOrder(token, { items: toOrderItems(items), note })
      clearCart()
      return order
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setSubmitting(false)
    }
  }

  return { placeOrder, submitting, error }
}
