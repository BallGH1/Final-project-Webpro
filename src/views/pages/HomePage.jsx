// หน้าแรก: ทางเข้าสำหรับเดโม — เลือกโต๊ะ (แทนการสแกน QR) หรือเข้าหน้าพนักงาน
import { Link } from 'react-router-dom'
import { useTables } from '../../controllers/useTables'
import Button from '../components/common/Button'
import { ErrorState, LoadingState } from '../components/common/StateMessages'

export default function HomePage() {
  const { tables, loading, error } = useTables()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 text-center">
        <p className="text-5xl">🍲</p>
        <h1 className="mt-2 text-3xl font-bold">Suki Order</h1>
        <p className="mt-1 text-stone-500">ระบบสั่งอาหารและจัดการออร์เดอร์ร้านสุกี้</p>
      </header>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">ลูกค้า: เลือกโต๊ะ</h2>
        <p className="mb-4 text-sm text-stone-500">ใช้งานจริงลูกค้าจะสแกน QR Code ที่โต๊ะเพื่อเข้าหน้านี้</p>
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={() => window.location.reload()} />}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {tables.map((table) => (
            <Link
              key={table.id}
              to={`/table/${table.id}`}
              className="rounded-xl border border-stone-200 py-4 text-center hover:border-brand hover:bg-brand-soft"
            >
              <span className="block text-lg font-bold">{table.id}</span>
              <span className="text-xs text-stone-500">{table.seats} ที่นั่ง</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-stone-900 p-5 text-white sm:flex-row sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">พนักงาน / หลังร้าน</h2>
          <p className="text-sm text-stone-400">ดูออร์เดอร์ใหม่ เปลี่ยนสถานะ และจัดการเมนู</p>
        </div>
        <Button to="/staff">เข้าสู่หน้าพนักงาน →</Button>
      </section>
    </main>
  )
}
