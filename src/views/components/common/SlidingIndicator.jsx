/**
 * กล่องพื้นหลังที่เลื่อนตามแท็บที่เลือก (ใช้คู่กับ useSlidingIndicator)
 * วางไว้เป็นลูกตัวแรกของกล่องแท็บ ส่วนแท็บต้องมี class "relative z-10" ให้อยู่เหนือกล่องนี้
 */
export default function SlidingIndicator({ indicatorRef, className = '' }) {
  return (
    <span
      ref={indicatorRef}
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 left-0 z-0 opacity-0 transition-[transform,width,height,opacity] duration-[380ms] ease-[var(--ease-soft)] ${className}`}
    />
  )
}
