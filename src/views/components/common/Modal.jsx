// หน้าต่าง Modal กลางของระบบ: ใช้ <dialog> ของ HTML + showModal() (สไตล์ modal ของ DaisyUI แบบ Lab 11)
// ได้มาจาก browser โดยไม่ต้องเขียนเอง:
// - กด Esc แล้วปิด
// - focus ย้ายเข้าไปในหน้าต่าง และกด Tab ไม่หลุดไปโดนปุ่มด้านหลัง (ส่วนอื่นของหน้าถูกปิดการใช้งานชั่วคราว)
// - ปิดแล้ว focus กลับไปที่ปุ่มที่กดเปิด
// Animation (ใน index.css): เปิด = จางเข้า+ขยาย (มือถือเลื่อนขึ้นจากล่าง), ปิด = เล่นย้อนกลับก่อนหายไป
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const EXIT_MS = 200 // ต้องตรงกับความยาว animation ตอนปิดใน index.css

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * แสดงเมื่อ component นี้ถูก render และปิดเมื่อหน้าแม่เลิก render (เปิด/ปิดด้วย state ของหน้าแม่)
 * children เป็นฟังก์ชันได้: (close) => ... — ปุ่มที่ปิดหน้าต่างควรเรียก close() เพื่อให้เล่น animation ตอนปิด
 * @param {() => void} onClose เรียกหลังเล่น animation ตอนปิดจบ (Esc / คลิกพื้นหลัง / close())
 * @param {boolean} [locked] true = ห้ามปิด (เช่น ระหว่างบันทึก)
 * @param {string} [role] 'dialog' หรือ 'alertdialog' (ข้อความสำคัญที่ต้องกดรับทราบ)
 */
export default function Modal({ onClose, labelledBy, locked = false, role = 'dialog', boxClassName = '', className = '', children }) {
  const ref = useRef(null)
  const [closing, setClosing] = useState(false)

  useLayoutEffect(() => {
    const dialog = ref.current
    const opener = document.activeElement // ปุ่มที่กดเปิด จะคืน focus ให้ตอนปิด
    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
      opener?.focus?.()
    }
  }, [])

  // เริ่มปิด → รอ animation ตอนปิดเล่นจบ แล้วค่อยให้หน้าแม่เอาหน้าต่างออก
  useEffect(() => {
    if (!closing) return
    const timer = setTimeout(onClose, EXIT_MS)
    return () => clearTimeout(timer)
  }, [closing, onClose])

  function close() {
    if (locked || closing) return
    if (prefersReducedMotion()) onClose()
    else setClosing(true)
  }

  function handleCancel(e) {
    e.preventDefault() // ให้ React เป็นคนปิด (เอา component ออก) ไม่ให้ browser ปิดเอง
    close()
  }

  return (
    <dialog
      ref={ref}
      role={role}
      aria-labelledby={labelledBy}
      onCancel={handleCancel}
      className={`modal modal-bottom sm:modal-middle ${closing ? 'modal-closing' : ''} ${className}`}
    >
      <div className={`modal-box ${boxClassName}`}>{typeof children === 'function' ? children(close) : children}</div>
      {/* คลิกพื้นหลังเพื่อปิด */}
      <div className="modal-backdrop" onClick={close} />
    </dialog>
  )
}
