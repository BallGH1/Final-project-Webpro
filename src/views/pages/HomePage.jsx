// หน้าแรก: อธิบายวิธีเข้าใช้ (ลูกค้าเข้าผ่าน QR ของบิลเท่านั้น) + ทางเข้าหน้าพนักงาน
import { ArrowRight, ChefHat, Clock, QrCode, ScanLine, Soup, UtensilsCrossed } from 'lucide-react'
import Button from '../components/common/Button'

const STEPS = [
  { Icon: QrCode, text: 'สแกน QR ที่โต๊ะ' },
  { Icon: UtensilsCrossed, text: 'เลือกเมนูลงตะกร้า' },
  { Icon: Clock, text: 'ติดตามสถานะออร์เดอร์' },
]

// ลำดับการเดโมบนคอมเครื่องเดียว
const DEMO_STEPS = [
  'พนักงานเข้า "โต๊ะ & บิล" แล้วกดเปิดโต๊ะ',
  'สแกน QR ที่ขึ้นมา (หรือกด "หน้าลูกค้า")',
  'สั่งอาหาร → เช็กบิล → พนักงานปิดโต๊ะ',
]

export default function HomePage() {
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
        {/* ลูกค้าเข้าได้ทาง QR ของบิลเท่านั้น จึงไม่มีปุ่มเลือกโต๊ะเองที่หน้านี้ */}
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body gap-4 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ScanLine size={22} aria-hidden="true" />
              </span>
              <div>
                <h2 className="card-title text-xl">ลูกค้า: สแกน QR Code บนสลิป</h2>
                <p className="text-sm text-base-content/60">
                  พนักงานจะให้สลิป QR เมื่อเปิดโต๊ะ สแกนแล้วสั่งอาหารเข้าบิลของโต๊ะคุณได้ทันที
                  QR เปลี่ยนใหม่ทุกครั้งที่เปิดโต๊ะ และใช้ไม่ได้หลังชำระเงิน
                </p>
              </div>
            </div>
            <ol className="grid gap-2 text-sm sm:grid-cols-3">
              {DEMO_STEPS.map((text, index) => (
                <li key={text} className="flex items-start gap-2 rounded-box bg-base-200 px-3 py-2.5">
                  <span className="badge badge-primary badge-sm mt-0.5 shrink-0">{index + 1}</span>
                  {text}
                </li>
              ))}
            </ol>
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
