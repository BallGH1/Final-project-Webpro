// หน้าโต๊ะ & บิล (พนักงาน): เห็นสถานะทุกโต๊ะ, เปิดโต๊ะ (ได้ QR ใหม่ทุกรอบ), ไปหน้าบิลเพื่อเก็บเงิน
import { useState } from 'react'
import { LayoutGrid, Map as MapIcon } from 'lucide-react'
import { useTables } from '../../../controllers/useTables'
import { useSlidingIndicator } from '../../../controllers/useSlidingIndicator'
import { useQrBaseUrl } from '../../../controllers/useQrBaseUrl'
import { SESSION_STATUS } from '../../../models/sessionModel'
import TableCard from '../../components/table/TableCard'
import SessionQrModal from '../../components/table/SessionQrModal'
import QrBaseUrlField from '../../components/table/QrBaseUrlField'
import FloorPlan from '../../components/table/FloorPlan'
import TableDrawer from '../../components/table/TableDrawer'
import SlidingIndicator from '../../components/common/SlidingIndicator'

const VIEWS = [
  { id: 'plan', label: 'ผังร้าน', Icon: MapIcon },
  { id: 'list', label: 'รายการ', Icon: LayoutGrid },
]

// จอใหญ่ (iPad / คอม) เปิดมาเป็นผังร้าน, มือถือเปิดมาเป็นรายการ (สลับได้ทั้งคู่)
const defaultView = () => (window.matchMedia?.('(min-width: 768px)').matches ? 'plan' : 'list')
import { ErrorState, LoadingState } from '../../components/common/StateMessages'

export default function TablesPage() {
  const { tables, loading, error, refresh, openTable, acknowledgeCall } = useTables()
  const { baseUrl, setBaseUrl, addresses, valid } = useQrBaseUrl()
  const [qrSession, setQrSession] = useState(null) // บิลที่กำลังแสดง QR (null = ปิดหน้าต่าง)
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [view, setView] = useState(defaultView)
  const [selectedId, setSelectedId] = useState(null) // โต๊ะที่แตะบนผัง (null = ปิดแผง)
  const { containerRef: viewTabsRef, indicatorRef: viewIndicatorRef } = useSlidingIndicator(view)
  const selectedTable = tables.find((t) => t.id === selectedId)

  const countOf = (status) => tables.filter((t) => (t.session?.status ?? 'free') === status).length

  async function handleOpen(table) {
    if (!valid) {
      setActionError('กรุณาใส่ URL ของเว็บให้ถูกต้องก่อนเปิดโต๊ะ')
      return
    }
    setBusyId(table.id)
    setActionError('')
    try {
      const session = await openTable(table.id)
      setSelectedId(null) // ปิดแผงรายละเอียด (ถ้าเปิดจากผัง) แล้วแสดง QR
      setQrSession(session)
    } catch (err) {
      setActionError(err.message)
      refresh()
    } finally {
      setBusyId(null)
    }
  }

  async function handleAcknowledge(tableId) {
    setActionError('')
    try {
      await acknowledgeCall(tableId)
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-5 print:hidden">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">โต๊ะ & บิล</h1>
          <p className="text-sm text-base-content/60">
            เปิดโต๊ะแล้วได้ QR ใหม่ทุกรอบ ลูกค้าสแกนแล้วสั่งอาหารเข้าบิลของตัวเอง ปิดบิลแล้ว QR ใช้ไม่ได้อีก
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="badge badge-success badge-soft">ว่าง {countOf('free')}</span>
            <span className="badge badge-warning badge-soft">มีลูกค้า {countOf(SESSION_STATUS.OPEN)}</span>
            <span className="badge badge-error badge-soft">ขอเช็กบิล {countOf(SESSION_STATUS.BILLING)}</span>
          </div>

          {/* สลับมุมมอง ผังร้าน / รายการ */}
          <div
            ref={viewTabsRef}
            role="tablist"
            aria-label="มุมมองโต๊ะ"
            className="relative flex rounded-field bg-base-300/50 p-1"
          >
            <SlidingIndicator indicatorRef={viewIndicatorRef} className="rounded-field bg-base-100 shadow-sm" />
            {VIEWS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={view === id}
                onClick={() => setView(id)}
                className={`btn btn-sm btn-ghost relative z-10 gap-1.5 hover:bg-transparent max-sm:min-h-11 ${
                  view === id ? 'text-base-content' : 'text-base-content/70'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <ErrorState message={error} onRetry={refresh} />}
        {actionError && <ErrorState message={actionError} />}

        {loading ? (
          <LoadingState text="กำลังโหลดโต๊ะ..." />
        ) : view === 'plan' ? (
          <FloorPlan tables={tables} selectedId={selectedId} onSelect={setSelectedId} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                busy={busyId === table.id}
                onOpen={handleOpen}
                onShowQr={setQrSession}
                onAcknowledge={handleAcknowledge}
              />
            ))}
          </div>
        )}

        {/* ตั้งค่าครั้งเดียวแล้วแทบไม่แตะอีก จึงพับเก็บไว้ (เปิดเองถ้า URL ไม่ถูกต้อง) */}
        <details open={!valid} className="group rounded-box border border-base-300 bg-base-100">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium">
            <span>ตั้งค่า URL ที่ใส่ใน QR (สำหรับสแกนจากมือถือ)</span>
            <span className="truncate text-base-content/60">{baseUrl}</span>
          </summary>
          <div className="border-t border-base-300">
            <QrBaseUrlField baseUrl={baseUrl} onChange={setBaseUrl} addresses={addresses} valid={valid} />
          </div>
        </details>
      </div>

      {selectedTable && (
        <TableDrawer
          table={selectedTable}
          busy={busyId === selectedTable.id}
          onOpen={handleOpen}
          onShowQr={(session) => {
            setSelectedId(null)
            setQrSession(session)
          }}
          onAcknowledge={handleAcknowledge}
          onClose={() => setSelectedId(null)}
        />
      )}

      {qrSession && <SessionQrModal session={qrSession} baseUrl={baseUrl} onClose={() => setQrSession(null)} />}
    </div>
  )
}
