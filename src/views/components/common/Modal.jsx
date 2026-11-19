// หน้าต่าง Modal กลางของระบบ: ใช้ <dialog> ของ HTML + showModal() (สไตล์ modal ของ DaisyUI แบบ Lab 11)
// ได้มาจาก browser โดยไม่ต้องเขียนเอง:
// - กด Esc แล้วปิด
// - focus ย้ายเข้าไปในหน้าต่าง และกด Tab ไม่หลุดไปโดนปุ่มด้านหลัง (ส่วนอื่นของหน้าถูกปิดการใช้งานชั่วคราว)
// - ปิดแล้ว focus กลับไปที่ปุ่มที่กดเปิด
import { useLayoutEffect, useRef } from 'react'

/**
 * แสดงเมื่อ component นี้ถูก render และปิดเมื่อหน้าแม่เลิก render (เปิด/ปิดด้วย state ของหน้าแม่)
 * @param {() => void} onClose เรียกเมื่อกด Esc หรือคลิกพื้นหลัง
 * @param {boolean} [locked] true = ห้ามปิด (เช่น ระหว่างบันทึก)
 * @param {string} [role] 'dialog' หรือ 'alertdialog' (ข้อความสำคัญที่ต้องกดรับทราบ)
 */
export default function Modal({ onClose, labelledBy, locked = false, role = 'dialog', boxClassName = '', className = '', children }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const dialog = ref.current
    const opener = document.activeElement // ปุ่มที่กดเปิด จะคืน focus ให้ตอนปิด
    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
      opener?.focus?.()
    }
  }, [])

  function handleCancel(e) {
    e.preventDefault() // ให้ React เป็นคนปิด (เอา component ออก) ไม่ให้ browser ปิดเอง
    if (!locked) onClose()
  }

  return (
    <dialog
      ref={ref}
      role={role}
      aria-labelledby={labelledBy}
      onCancel={handleCancel}
      className={`modal modal-bottom sm:modal-middle ${className}`}
    >
      <div className={`modal-box ${boxClassName}`}>{children}</div>
      {/* คลิกพื้นหลังเพื่อปิด */}
      <div className="modal-backdrop" onClick={locked ? undefined : onClose} />
    </dialog>
  )
}
