// Controller (UI): เลื่อนและซูมผังร้านแบบแผนที่
// - ลากพื้นผังได้อิสระทุกทิศ ทั้งนิ้ว (iPad) และเมาส์ — ลากได้แม้ตอนผังพอดีจอ
// - ซูมด้วยปุ่ม +/− และ "พอดีจอ" แบบนุ่ม ๆ (animation อยู่ที่ FloorPlan) โดยจุดกลางจอไม่หลุด
import { useEffect, useRef, useState } from 'react'

const MIN_SCALE = 0.35
const MAX_SCALE = 1.6
const ZOOM_STEP = 1.2
const DRAG_THRESHOLD = 5 // ลากเกินกี่ px ถึงนับว่า "ลาก" (ไม่ใช่แตะโต๊ะ)

const clamp = (value) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value))

export function usePanZoom(planWidth, planHeight) {
  const viewportRef = useRef(null)
  const dragRef = useRef(null)
  const movedRef = useRef(false)
  const fittedRef = useRef(false)
  const [view, setView] = useState({ x: 0, y: 0, scale: 0.6 })
  const [dragging, setDragging] = useState(false)

  function fitView() {
    const el = viewportRef.current
    const scale = clamp(Math.min(el.clientWidth / planWidth, el.clientHeight / planHeight) * 0.95)
    return { scale, x: (el.clientWidth - planWidth * scale) / 2, y: (el.clientHeight - planHeight * scale) / 2 }
  }

  // ครั้งแรกที่รู้ขนาดพื้นที่: จัดผังให้พอดีจอ
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      if (fittedRef.current || el.clientWidth === 0) return
      fittedRef.current = true
      const scale = clamp(Math.min(el.clientWidth / planWidth, el.clientHeight / planHeight) * 0.95)
      setView({ scale, x: (el.clientWidth - planWidth * scale) / 2, y: (el.clientHeight - planHeight * scale) / 2 })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [planWidth, planHeight])

  /** ซูมรอบจุดกลางจอ */
  function zoomBy(factor) {
    const el = viewportRef.current
    setView((v) => {
      const scale = clamp(v.scale * factor)
      const cx = el.clientWidth / 2
      const cy = el.clientHeight / 2
      return { scale, x: cx - ((cx - v.x) * scale) / v.scale, y: cy - ((cy - v.y) * scale) / v.scale }
    })
  }

  function onPointerDown(e) {
    if (e.button !== 0 || e.target.closest('[data-pan-ignore]')) return
    dragRef.current = { px: e.clientX, py: e.clientY, x: view.x, y: view.y, id: e.pointerId }
    movedRef.current = false
  }
  function onPointerMove(e) {
    const drag = dragRef.current
    if (!drag || drag.id !== e.pointerId) return
    const dx = e.clientX - drag.px
    const dy = e.clientY - drag.py
    if (!movedRef.current) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
      movedRef.current = true
      setDragging(true)
      viewportRef.current.setPointerCapture(e.pointerId) // ลากออกนอกกรอบก็ยังลากต่อได้
    }
    setView((v) => ({ ...v, x: drag.x + dx, y: drag.y + dy }))
  }
  function onPointerUp() {
    dragRef.current = null
    setDragging(false)
  }
  /** กันการแตะโต๊ะ ถ้าเพิ่งลากผังมา */
  function onClickCapture(e) {
    if (movedRef.current) {
      movedRef.current = false
      e.stopPropagation()
      e.preventDefault()
    }
  }

  return {
    viewportRef,
    view,
    dragging,
    zoomIn: () => zoomBy(ZOOM_STEP),
    zoomOut: () => zoomBy(1 / ZOOM_STEP),
    fit: () => setView(fitView()),
    canZoomIn: view.scale < MAX_SCALE,
    canZoomOut: view.scale > MIN_SCALE,
    panHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
    },
  }
}
