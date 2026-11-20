// Controller (UI): ตัวเลขไหลขึ้น/ลงนุ่ม ๆ ไปหาค่าใหม่ (ใช้กับกล่องตัวเลขสรุปในหน้าสถิติ)
import { useEffect, useRef, useState } from 'react'

const DURATION = 700
const easeOut = (t) => 1 - (1 - t) ** 3

export function useCountUp(target) {
  const [value, setValue] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const from = fromRef.current
    let frame
    const start = performance.now()
    function step(now) {
      const t = reduce ? 1 : Math.min(1, (now - start) / DURATION)
      const next = from + (target - from) * easeOut(t)
      fromRef.current = next
      setValue(next)
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return value
}
