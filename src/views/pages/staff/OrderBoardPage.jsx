// หน้า Dashboard ออร์เดอร์ (พนักงาน): ออร์เดอร์ใหม่เข้ามาเองทุกไม่กี่วินาที + เปลี่ยนสถานะ
import { useState } from 'react'
import { Ban, CircleCheck, Flame, HandCoins, Sparkles } from 'lucide-react'
import { useOrders } from '../../../controllers/useOrders'
import { useTables } from '../../../controllers/useTables'
import { SESSION_STATUS } from '../../../models/sessionModel'
import OrderCard from '../../components/order/OrderCard'
import CancelOrderModal from '../../components/order/CancelOrderModal'
import Button from '../../components/common/Button'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateMessages'
import { NEXT_STATUS, STATUS_ACTION_LABEL, STATUS_LABEL } from '../../../models/orderModel'
import { formatTime } from '../../../models/formatters'

const FILTERS = ['all', 'pending', 'preparing', 'served', 'cancelled']

const ACTION_ICONS = { preparing: Flame, served: CircleCheck, cancelled: Ban }

export default function OrderBoardPage() {
  const { orders, loading, error, lastUpdated, refresh, changeStatus } = useOrders()
  const [filter, setFilter] = useState('pending')
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null) // ออร์เดอร์ที่กำลังเลือกเหตุผลยกเลิก

  // error จะโยนกลับไปให้หน้าต่างยกเลิกแสดง
  async function handleCancel(reason) {
    await changeStatus(cancelTarget.id, 'cancelled', reason)
    setCancelTarget(null)
  }
  // โต๊ะที่ลูกค้ากดขอเช็กบิล — แจ้งเตือนบนหน้านี้ด้วย พนักงานจะได้ไม่พลาด
  const { tables } = useTables()
  const billingTables = tables.filter((t) => t.session?.status === SESSION_STATUS.BILLING)

  const countOf = (status) => (status === 'all' ? orders.length : orders.filter((o) => o.status === status).length)
  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  async function handleChange(orderId, status) {
    setBusyId(orderId)
    setActionError('')
    try {
      await changeStatus(orderId, status)
    } catch (err) {
      setActionError(err.message)
      refresh()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">ออร์เดอร์</h1>
          <p className="text-sm text-base-content/60">ออร์เดอร์ใหม่จะขึ้นเองโดยไม่ต้องรีเฟรช</p>
        </div>
        {lastUpdated && (
          <p className="flex items-center gap-1.5 text-xs text-base-content/60">
            <span className="status status-success animate-pulse" aria-hidden="true" />
            ล่าสุด {formatTime(lastUpdated)} น.
          </p>
        )}
      </div>

      {billingTables.length > 0 && (
        <div role="status" className="alert alert-error alert-soft flex flex-wrap items-center gap-2">
          <HandCoins size={18} aria-hidden="true" />
          <span className="font-semibold">ขอเช็กบิล:</span>
          {billingTables.map((table) => (
            <Button key={table.id} to={`/staff/tables/bill/${table.session.id}`} size="sm" variant="secondary">
              โต๊ะ {table.id}
            </Button>
          ))}
        </div>
      )}

      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <div role="tablist" aria-label="กรองตามสถานะ" className="tabs tabs-box w-max flex-nowrap bg-base-100">
          {FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              role="tab"
              aria-selected={filter === status}
              onClick={() => setFilter(status)}
              className={`tab gap-2 whitespace-nowrap max-sm:min-h-11 ${filter === status ? 'tab-active' : ''}`}
            >
              {status === 'all' ? 'ทั้งหมด' : STATUS_LABEL[status]}
              <span className={`badge badge-sm ${status === 'pending' && countOf(status) > 0 ? 'badge-warning' : 'badge-ghost'}`}>
                {countOf(status)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={refresh} />}
      {actionError && <ErrorState message={actionError} />}

      {loading ? (
        <LoadingState text="กำลังโหลดออร์เดอร์..." />
      ) : visible.length === 0 ? (
        <EmptyState icon={Sparkles} title="ไม่มีออร์เดอร์ในสถานะนี้" />
      ) : (
        <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              showTable
              actions={NEXT_STATUS[order.status].map((next) => {
                const Icon = ACTION_ICONS[next]
                return (
                  <Button
                    key={next}
                    size="sm"
                    variant={next === 'cancelled' ? 'ghost' : 'primary'}
                    disabled={busyId === order.id}
                    onClick={() => (next === 'cancelled' ? setCancelTarget(order) : handleChange(order.id, next))}
                  >
                    {Icon && <Icon size={14} aria-hidden="true" />}
                    {STATUS_ACTION_LABEL[next]}
                  </Button>
                )
              })}
            />
          ))}
        </div>
      )}

      {cancelTarget && (
        <CancelOrderModal order={cancelTarget} onConfirm={handleCancel} onClose={() => setCancelTarget(null)} />
      )}
    </div>
  )
}
