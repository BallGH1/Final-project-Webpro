import { BellRing, Clock, HandCoins, Users } from 'lucide-react'
import SpeechBubble from './SpeechBubble'
import { CHAIR_GAP, tableSize } from '../../../../shared/floorPlan.js'
import { SESSION_STATUS } from '../../../models/sessionModel'
import { formatMoney } from '../../../models/formatters'
import { formatDuration } from '../../../controllers/useNow'

// สีพื้นโต๊ะตามสถานะ (เห็นชัดจากไกล): เขียว = ว่าง, ส้ม = มีลูกค้า, แดงเต้นช้า ๆ = ขอเช็กบิล
const TOP_STYLES = {
  free: 'border-success bg-success/15 text-[var(--soft-success-fg)]',
  open: 'border-warning bg-warning/25 text-[var(--soft-warning-fg)]',
  billing: 'border-error bg-error/15 text-error animate-soft-pulse',
}

const STATUS_TEXT = { free: 'ว่าง', open: 'มีลูกค้า', billing: 'ขอเช็กบิล' }

/** โต๊ะ 1 ตัวบนผังร้าน มองจากด้านบน: พื้นโต๊ะ + เก้าอี้รอบโต๊ะตามจำนวนที่นั่ง */
export default function FloorTable({ table, position, selected, now, onSelect }) {
  const { session } = table
  const status = session?.status ?? 'free'
  const { perSide, width, height } = tableSize(table.seats)
  const chairStart = (width - perSide * CHAIR_GAP) / 2 + 6
  const urgent = status === SESSION_STATUS.BILLING || Boolean(session?.staffCall)

  return (
    <button
      type="button"
      onClick={() => onSelect(table.id)}
      aria-label={`โต๊ะ ${table.id} ${STATUS_TEXT[status]}${session ? ` ยอด ${formatMoney(session.total)}` : ''}${
        session?.staffCall ? ` เรียกพนักงาน: ${session.staffCall.reason}` : ''
      }`}
      style={{ left: position.x, top: position.y, width, height }}
      className={`group absolute transition-transform duration-200 ease-[var(--ease-soft)] hover:-translate-y-0.5 active:scale-[0.97] ${
        urgent ? 'z-10' : ''
      }`}
    >
      {/* กล่องคำพูดเหนือโต๊ะ: เฉพาะเรื่องด่วน (เรียกพนักงาน / ขอเช็กบิล) */}
      {urgent && (
        <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 flex -translate-x-1/2 flex-col items-center gap-2.5">
          {session.staffCall && (
            <SpeechBubble key={session.staffCall.at} tone="call" icon={BellRing}>
              {session.staffCall.reason}
            </SpeechBubble>
          )}
          {status === SESSION_STATUS.BILLING && (
            <SpeechBubble tone="bill" icon={HandCoins}>
              เช็กบิล!
            </SpeechBubble>
          )}
        </span>
      )}

      {/* เก้าอี้ฝั่งบนและฝั่งล่าง */}
      {Array.from({ length: perSide }, (_, i) => (
        <span key={i} aria-hidden="true">
          <span
            className="absolute top-1 h-4 w-7 rounded-lg border border-base-content/25 bg-base-100"
            style={{ left: chairStart + i * CHAIR_GAP }}
          />
          <span
            className="absolute bottom-1 h-4 w-7 rounded-lg border border-base-content/25 bg-base-100"
            style={{ left: chairStart + i * CHAIR_GAP }}
          />
        </span>
      ))}

      {/* พื้นโต๊ะ */}
      <span
        className={`absolute inset-x-2 inset-y-[22px] flex flex-col items-center justify-center gap-0.5 rounded-2xl border-2 shadow-sm transition-[background-color,border-color,box-shadow] duration-300 ${
          TOP_STYLES[status]
        } ${selected ? 'outline-4 outline-offset-4 outline-info/60' : ''}`}
      >
        <span className="font-display text-lg leading-tight font-semibold">{table.id}</span>
        {session ? (
          <>
            <span className="flex items-center gap-1 text-xs">
              {status === SESSION_STATUS.BILLING ? (
                <HandCoins size={12} aria-hidden="true" />
              ) : (
                <Clock size={12} aria-hidden="true" />
              )}
              {status === SESSION_STATUS.BILLING ? 'ขอเช็กบิล' : formatDuration(session.openedAt, now)}
            </span>
            <span className="text-sm font-semibold">{formatMoney(session.total)}</span>
          </>
        ) : (
          <span className="flex items-center gap-1 text-xs">
            <Users size={12} aria-hidden="true" />
            {table.seats} ที่นั่ง
          </span>
        )}
      </span>
    </button>
  )
}
