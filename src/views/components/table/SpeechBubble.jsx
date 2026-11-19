/**
 * กล่องคำพูดแบบมังงะเหนือโต๊ะบนผังร้าน — ใช้เฉพาะเรื่องที่พนักงานต้องรีบไปดู
 * tone: 'bill' = ขอเช็กบิล (แดง), 'call' = เรียกพนักงาน (ฟ้า)
 * เด้งขึ้นแบบนุ่ม ๆ ตอนมีเรื่องใหม่ (ใส่ key ที่เปลี่ยนตามเรื่อง เพื่อให้เด้งซ้ำเมื่อเรียกใหม่)
 */
const TONES = {
  bill: 'border-error bg-error text-error-content',
  call: 'border-info bg-info text-info-content',
}

export default function SpeechBubble({ tone, icon: Icon, children }) {
  return (
    <span
      className={`animate-bubble relative flex items-center gap-1.5 rounded-2xl border-2 px-3 py-1.5 text-sm font-semibold whitespace-nowrap shadow-md ${TONES[tone]}`}
    >
      {Icon && <Icon size={15} aria-hidden="true" />}
      {children}
      {/* หางของกล่องคำพูด ชี้ลงไปที่โต๊ะ */}
      <span
        aria-hidden="true"
        className={`absolute -bottom-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 ${TONES[tone]}`}
      />
    </span>
  )
}
