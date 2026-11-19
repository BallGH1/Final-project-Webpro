// Controller (UI): พื้นหลังของแท็บที่เลือก "เลื่อนไหล" ไปหาแท็บใหม่ แทนการกระโดด
// วิธีใช้: ใส่ containerRef ที่กล่องแท็บ (ต้องเป็น relative) + วาง <span ref={indicatorRef}> ไว้ในกล่อง
// แท็บที่เลือกต้องมี aria-selected="true" (ปุ่มแท็บ) หรือ aria-current="page" (NavLink ใส่ให้เอง)
import { useLayoutEffect, useRef } from 'react'

const ACTIVE_SELECTOR = '[aria-selected="true"], [aria-current="page"]'

/** @param activeKey ค่าที่เปลี่ยนเมื่อเลือกแท็บใหม่ (เช่น id หมวด หรือ pathname) */
export function useSlidingIndicator(activeKey) {
  const containerRef = useRef(null)
  const indicatorRef = useRef(null)
  const placedRef = useRef(false) // วางครั้งแรกแล้วหรือยัง (ครั้งแรกไม่ต้องเลื่อน ให้โผล่ตรงที่เลย)

  useLayoutEffect(() => {
    const container = containerRef.current
    const indicator = indicatorRef.current
    if (!container || !indicator) return

    // ขยับ DOM ตรง ๆ ผ่าน ref (ไม่ใช้ state) จึงไม่ทำให้ component render ซ้ำ
    function place() {
      const active = container.querySelector(ACTIVE_SELECTOR)
      if (!active) {
        indicator.style.opacity = '0'
        return
      }
      if (!placedRef.current) indicator.style.transition = 'none'
      indicator.style.opacity = '1'
      indicator.style.width = `${active.offsetWidth}px`
      indicator.style.height = `${active.offsetHeight}px`
      indicator.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`
      if (!placedRef.current) {
        placedRef.current = true
        void indicator.offsetWidth // บังคับให้ browser วางตำแหน่งแรกให้เสร็จก่อน แล้วค่อยเปิด transition กลับ
        indicator.style.transition = ''
      }
    }

    place()
    document.fonts?.ready.then(place) // ฟอนต์ไทยโหลดเสร็จ → ความกว้างแท็บเปลี่ยน
    // ขนาดแท็บเปลี่ยน (จอหมุน, ตัวเลขใน badge เปลี่ยน, ฟอนต์โหลดเสร็จ) → วางใหม่
    const observer = new ResizeObserver(place)
    observer.observe(container)
    for (const child of container.children) observer.observe(child)
    return () => observer.disconnect()
  }, [activeKey])

  return { containerRef, indicatorRef }
}
