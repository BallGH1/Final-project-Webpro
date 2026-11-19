// หน้าโต๊ะ & บิล (พนักงาน): เห็นสถานะทุกโต๊ะ, เปิดโต๊ะ (ได้ QR ใหม่ทุกรอบ), ไปหน้าบิลเพื่อเก็บเงิน
import { useState } from 'react'
import { useTables } from '../../../controllers/useTables'
import { useQrBaseUrl } from '../../../controllers/useQrBaseUrl'
import { SESSION_STATUS } from '../../../models/sessionModel'
import TableCard from '../../components/table/TableCard'
import SessionQrModal from '../../components/table/SessionQrModal'
import QrBaseUrlField from '../../components/table/QrBaseUrlField'
import { ErrorState, LoadingState } from '../../components/common/StateMessages'

export default function TablesPage() {
  const { tables, loading, error, refresh, openTable } = useTables()
  const { baseUrl, setBaseUrl, addresses, valid } = useQrBaseUrl()
  const [qrSession, setQrSession] = useState(null) // บิลที่กำลังแสดง QR (null = ปิดหน้าต่าง)
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

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
      setQrSession(session)
    } catch (err) {
      setActionError(err.message)
      refresh()
    } finally {
      setBusyId(null)
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

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="badge badge-success badge-soft">ว่าง {countOf('free')}</span>
          <span className="badge badge-warning badge-soft">มีลูกค้า {countOf(SESSION_STATUS.OPEN)}</span>
          <span className="badge badge-error badge-soft">ขอเช็กบิล {countOf(SESSION_STATUS.BILLING)}</span>
        </div>

        {error && <ErrorState message={error} onRetry={refresh} />}
        {actionError && <ErrorState message={actionError} />}

        {loading ? (
          <LoadingState text="กำลังโหลดโต๊ะ..." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                busy={busyId === table.id}
                onOpen={handleOpen}
                onShowQr={setQrSession}
              />
            ))}
          </div>
        )}

        <QrBaseUrlField baseUrl={baseUrl} onChange={setBaseUrl} addresses={addresses} valid={valid} />
      </div>

      {qrSession && <SessionQrModal session={qrSession} baseUrl={baseUrl} onClose={() => setQrSession(null)} />}
    </div>
  )
}
