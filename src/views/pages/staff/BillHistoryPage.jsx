// หน้าประวัติบิล (พนักงาน): บิลที่ชำระแล้วย้อนหลัง กรองตามช่วงเวลาและโต๊ะ กดเข้าไปดูรายละเอียดบิลได้
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Clock, History, ReceiptText } from 'lucide-react'
import { getBills } from '../../../models/statsModel'
import { formatDateTime, formatMoney } from '../../../models/formatters'
import { formatDuration } from '../../../controllers/useNow'
import { usePolling } from '../../../controllers/usePolling'
import { useTables } from '../../../controllers/useTables'
import RangeTabs from '../../components/stats/RangeTabs'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateMessages'

export default function BillHistoryPage() {
  const [range, setRange] = useState('7d')
  const [tableId, setTableId] = useState('')
  const { data: bills, loading, error, refresh } = usePolling(() => getBills({ range, tableId }), `${range}-${tableId}`)
  const { tables } = useTables()

  const total = (bills ?? []).reduce((sum, b) => sum + b.total, 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">ประวัติบิล</h1>
          <p className="text-sm text-base-content/70">บิลที่ชำระแล้ว ใหม่สุดก่อน · กดบิลเพื่อดูรายการอาหาร</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="select select-sm w-auto max-sm:min-h-11">
            <span className="label">โต๊ะ</span>
            <select value={tableId} onChange={(e) => setTableId(e.target.value)} aria-label="กรองตามโต๊ะ">
              <option value="">ทุกโต๊ะ</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id}
                </option>
              ))}
            </select>
          </label>
          <RangeTabs value={range} onChange={setRange} />
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={refresh} />}

      {loading ? (
        <LoadingState text="กำลังโหลดประวัติบิล..." />
      ) : !bills || bills.length === 0 ? (
        <EmptyState icon={History} title="ยังไม่มีบิลที่ชำระแล้วในช่วงนี้" text="ลองเปลี่ยนช่วงเวลาหรือโต๊ะ" />
      ) : (
        <>
          <div className="animate-fade-up flex flex-wrap items-center gap-x-6 gap-y-1 rounded-box border border-base-300 bg-base-100 px-4 py-3 text-sm">
            <span>
              <span className="text-base-content/70">จำนวนบิล </span>
              <b className="tabular-nums">{bills.length}</b>
            </span>
            <span>
              <span className="text-base-content/70">ยอดรวม </span>
              <b className="text-primary tabular-nums">{formatMoney(total)}</b>
            </span>
            <span>
              <span className="text-base-content/70">เฉลี่ย / บิล </span>
              <b className="tabular-nums">{formatMoney(Math.round(total / bills.length))}</b>
            </span>
          </div>

          <ul className="overflow-hidden rounded-box border border-base-300 bg-base-100">
            {bills.map((bill, index) => (
              <li
                key={bill.id}
                className="animate-fade-up border-b border-base-300 last:border-b-0"
                style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
              >
                <Link
                  to={`/staff/tables/bill/${bill.id}`}
                  className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-base-200"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ReceiptText size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 font-semibold">
                      {bill.billNo}
                      <span className="badge badge-sm badge-primary badge-soft">โต๊ะ {bill.tableId}</span>
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2 text-xs text-base-content/70">
                      <span>ชำระ {formatDateTime(bill.closedAt)}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} aria-hidden="true" />
                        นั่ง {formatDuration(bill.openedAt, new Date(bill.closedAt).getTime())}
                      </span>
                      <span>{bill.orderCount} ออร์เดอร์</span>
                    </span>
                  </span>
                  <span className="shrink-0 font-display text-lg font-semibold tabular-nums">{formatMoney(bill.total)}</span>
                  <ChevronRight size={18} className="shrink-0 text-base-content/50" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
