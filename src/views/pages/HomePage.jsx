// หน้าแรก: ทางเข้าสำหรับเดโม — เลือกโต๊ะ (แทนการสแกน QR) หรือเข้าหน้าพนักงาน
import { Link } from 'react-router-dom'
import { ArrowRight, ChefHat, Clock, QrCode, Soup, Users, UtensilsCrossed } from 'lucide-react'
import { useTables } from '../../controllers/useTables'
import Button from '../components/common/Button'
import { ErrorState, LoadingState } from '../components/common/StateMessages'

const STEPS = [
  { Icon: QrCode, text: 'สแกน QR ที่โต๊ะ' },
  { Icon: UtensilsCrossed, text: 'เลือกเมนูลงตะกร้า' },
  { Icon: Clock, text: 'ติดตามสถานะออร์เดอร์' },
]

export default function HomePage() {
  const { tables, loading, error } = useTables()

  return (
    <div className="min-h-screen pb-10">
      {/* Hero banner (hero ของ DaisyUI) */}
      <section className="hero bg-linear-to-br from-primary to-[oklch(38%_0.15_25)] text-primary-content">
        <div className="hero-content w-full max-w-5xl flex-col items-start gap-6 px-4 py-12 sm:py-16">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Soup size={30} aria-hidden="true" />
          </span>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold sm:text-5xl">Suki Teeyai</h1>
            <p className="max-w-md text-base opacity-85 sm:text-lg">
              สั่งสุกี้ได้จากโต๊ะ ไม่ต้องรอพนักงาน ออร์เดอร์ส่งตรงถึงครัวทันที
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {STEPS.map(({ Icon, text }) => (
              <li key={text} className="badge h-auto gap-1.5 border-white/25 bg-white/10 px-3 py-1.5 text-sm text-primary-content">
                <Icon size={14} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto -mt-6 max-w-5xl space-y-6 px-4">
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body gap-4 p-5 sm:p-6">
            <div>
              <h2 className="card-title text-xl">เลือกโต๊ะของคุณ</h2>
              <p className="text-sm text-base-content/60">ใช้งานจริงลูกค้าจะสแกน QR Code ที่โต๊ะเพื่อเข้าหน้านี้</p>
            </div>
            {loading && <LoadingState />}
            {error && <ErrorState message={error} onRetry={() => window.location.reload()} />}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {tables.map((table) => (
                <Link
                  key={table.id}
                  to={`/table/${table.id}`}
                  className="group flex flex-col items-center gap-1 rounded-box border border-base-300 bg-base-100 px-2 py-4 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span className="font-display text-2xl font-semibold group-hover:text-primary">{table.id}</span>
                  <span className="flex items-center gap-1 text-xs text-base-content/60">
                    <Users size={12} aria-hidden="true" />
                    {table.seats} ที่นั่ง
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="card bg-neutral text-neutral-content shadow-sm">
          <div className="card-body flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <ChefHat size={22} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">พนักงาน / หลังร้าน</h2>
                <p className="text-sm opacity-70">ดูออร์เดอร์ใหม่ เปลี่ยนสถานะ และจัดการเมนู</p>
              </div>
            </div>
            <Button to="/staff" className="w-full sm:w-auto">
              เข้าสู่หน้าพนักงาน
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
