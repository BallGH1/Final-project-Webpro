// หน้าสถิติ (พนักงาน): ยอดขาย, บิล, ออร์เดอร์, เวลาเสิร์ฟ, กราฟยอดขาย, เมนูขายดี, ยอดตามหมวด, สถานะร้านตอนนี้
// ข้อมูลคำนวณที่ server (/api/stats) แล้วดึงใหม่ทุก 30 วินาที
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BellRing, ChefHat, Clock, HandCoins, ReceiptText, Soup, Timer, Users, Wallet } from 'lucide-react'
import { RANGES, getStats, percentChange } from '../../../models/statsModel'
import { formatMoney } from '../../../models/formatters'
import { usePolling } from '../../../controllers/usePolling'
import RangeTabs from '../../components/stats/RangeTabs'
import StatCard from '../../components/stats/StatCard'
import BarChart from '../../components/stats/BarChart'
import HBarList from '../../components/stats/HBarList'
import FoodImage from '../../components/common/FoodImage'
import { ErrorState, LoadingState } from '../../components/common/StateMessages'

const money = (v) => formatMoney(Math.round(v))
const count = (v) => Math.round(v).toLocaleString('th-TH')
const percent = (v) => `${(v * 100).toFixed(0)}%`
const minutes = (v) => `${Math.round(v)} นาที`

function Panel({ title, icon: Icon, action, delay = 0, className = '', children }) {
  return (
    <section
      className={`card animate-fade-up border border-base-300 bg-base-100 shadow-sm ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="card-body gap-4 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Icon size={18} className="text-primary" aria-hidden="true" />
            {title}
          </h2>
          {action}
        </div>
        {children}
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const [range, setRange] = useState('today')
  const { data, loading, error, refresh } = usePolling(() => getStats(range), range)
  const compareLabel = RANGES.find((r) => r.id === range).compare

  if (loading) return <LoadingState text="กำลังคำนวณสถิติ..." />
  if (!data) return <ErrorState message={error || 'โหลดสถิติไม่สำเร็จ'} onRetry={refresh} />

  const { current, previous, live } = data

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">สถิติร้าน</h1>
          <p className="text-sm text-base-content/70">อัปเดตเองทุก 30 วินาที · นับตามเวลาไทย</p>
        </div>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      {error && <ErrorState message={error} onRetry={refresh} />}

      {/* ตัวเลขสรุป */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="ยอดขาย"
          value={current.revenue}
          format={money}
          change={percentChange(current.revenue, previous.revenue)}
          compareLabel={compareLabel}
          sub={`ชำระแล้ว ${money(current.paid)}`}
        />
        <StatCard
          icon={ReceiptText}
          label="บิลที่ชำระแล้ว"
          value={current.bills}
          format={count}
          change={percentChange(current.bills, previous.bills)}
          compareLabel={compareLabel}
          sub={`เฉลี่ย ${money(current.avgPerBill)} / บิล`}
          delay={60}
        />
        <StatCard
          icon={Soup}
          label="ออร์เดอร์"
          value={current.orders}
          format={count}
          change={percentChange(current.orders, previous.orders)}
          compareLabel={compareLabel}
          sub={`ยกเลิก ${current.cancelled} (${percent(current.cancelRate)})`}
          delay={120}
        />
        <StatCard
          icon={Timer}
          label="เวลาเฉลี่ย สั่ง → เสิร์ฟ"
          value={current.avgServeMinutes}
          format={minutes}
          change={
            current.avgServeMinutes && previous.avgServeMinutes
              ? percentChange(current.avgServeMinutes, previous.avgServeMinutes)
              : null
          }
          compareLabel={compareLabel}
          goodWhenUp={false}
          sub={current.avgServeMinutes === null ? 'ยังไม่มีออร์เดอร์ที่เสิร์ฟ' : undefined}
          delay={180}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          title={data.seriesUnit === 'hour' ? 'ยอดขายรายชั่วโมง' : 'ยอดขายรายวัน'}
          icon={Clock}
          className="xl:col-span-2"
          delay={200}
        >
          <BarChart
            key={range}
            data={data.series}
            format={money}
            label={data.seriesUnit === 'hour' ? 'ยอดขายรายชั่วโมง' : 'ยอดขายรายวัน'}
            emptyText="ยังไม่มียอดขายในช่วงนี้"
          />
        </Panel>

        <Panel title="ตอนนี้ในร้าน" icon={Users} delay={260}>
          <ul className="grid grid-cols-2 gap-3">
            {[
              { label: 'โต๊ะมีลูกค้า', value: live.occupied, Icon: Users, to: '/staff/tables' },
              { label: 'ขอเช็กบิล', value: live.billing, Icon: HandCoins, to: '/staff/tables', alert: live.billing > 0 },
              { label: 'เรียกพนักงาน', value: live.calling, Icon: BellRing, to: '/staff/tables', alert: live.calling > 0 },
              { label: 'ออร์เดอร์รอรับ', value: live.pendingOrders, Icon: ChefHat, to: '/staff', alert: live.pendingOrders > 0 },
            ].map(({ label, value, Icon, to, alert }) => (
              <li key={label}>
                <Link
                  to={to}
                  className={`flex min-h-20 flex-col justify-between rounded-box border p-3 transition-[background-color,border-color] duration-300 hover:bg-base-200 ${
                    alert ? 'border-error/50 bg-error/5' : 'border-base-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs text-base-content/70">
                    <Icon size={14} aria-hidden="true" />
                    {label}
                  </span>
                  <span className={`font-display text-2xl font-semibold tabular-nums ${alert ? 'text-error' : ''}`}>{value}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-base-content/70">กำลังเตรียมอาหาร {live.preparingOrders} ออร์เดอร์</p>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="เมนูขายดี" icon={Soup} delay={320}>
          <HBarList
            key={`top-${range}`}
            format={(v) => `${v} ที่`}
            emptyText="ยังไม่มีเมนูที่ขายได้ในช่วงนี้"
            items={data.topMenus.map((m, index) => ({
              key: m.menuId,
              label: m.name,
              value: m.qty,
              detail: money(m.revenue),
              leading: (
                <>
                  <span className="w-4 text-center text-xs font-semibold text-base-content/70">{index + 1}</span>
                  <FoodImage name={m.name} emoji={m.image} iconSize={14} className="size-8 rounded-lg" />
                </>
              ),
            }))}
          />
        </Panel>

        <Panel title="ยอดขายตามหมวด" icon={Wallet} delay={380}>
          <HBarList
            key={`cat-${range}`}
            format={money}
            emptyText="ยังไม่มียอดขายในช่วงนี้"
            items={data.categories.map((c) => ({
              key: c.id,
              label: c.name,
              value: c.value,
              detail: current.revenue ? percent(c.value / current.revenue) : undefined,
            }))}
          />
        </Panel>
      </div>
    </div>
  )
}
