// หน้า Dashboard ออร์เดอร์ (พนักงาน): ออร์เดอร์ใหม่เข้ามาเองทุกไม่กี่วินาที + เปลี่ยนสถานะ
import { useState } from 'react'
import { useOrders } from '../../../controllers/useOrders'
import OrderCard from '../../components/order/OrderCard'
import Button from '../../components/common/Button'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateMessages'
import { NEXT_STATUS, STATUS_ACTION_LABEL, STATUS_LABEL } from '../../../models/orderModel'
import { formatTime } from '../../../models/formatters'

const FILTERS = ['all', 'pending', 'preparing', 'served', 'cancelled']

export default function OrderBoardPage() {
  const { orders, loading, error, lastUpdated, refresh, changeStatus } = useOrders()
  const [filter, setFilter] = useState('pending')
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState(null)

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
        <h1 className="text-2xl font-bold">ออร์เดอร์</h1>
        {lastUpdated && (
          <p className="text-xs text-stone-500">อัปเดตอัตโนมัติ · ล่าสุด {formatTime(lastUpdated)} น.</p>
        )}
      </div>

      <div role="tablist" aria-label="กรองตามสถานะ" className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={filter === status}
            onClick={() => setFilter(status)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              filter === status ? 'bg-stone-900 text-white' : 'bg-white ring-1 ring-stone-200 hover:bg-stone-100'
            }`}
          >
            {status === 'all' ? 'ทั้งหมด' : STATUS_LABEL[status]} ({countOf(status)})
          </button>
        ))}
      </div>

      {error && <ErrorState message={error} onRetry={refresh} />}
      {actionError && <ErrorState message={actionError} />}

      {loading ? (
        <LoadingState text="กำลังโหลดออร์เดอร์..." />
      ) : visible.length === 0 ? (
        <EmptyState icon="✨" title="ไม่มีออร์เดอร์ในสถานะนี้" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              showTable
              actions={NEXT_STATUS[order.status].map((next) => (
                <Button
                  key={next}
                  size="sm"
                  variant={next === 'cancelled' ? 'secondary' : 'primary'}
                  disabled={busyId === order.id}
                  onClick={() => handleChange(order.id, next)}
                >
                  {STATUS_ACTION_LABEL[next]}
                </Button>
              ))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
