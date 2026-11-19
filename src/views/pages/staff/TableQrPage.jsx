// หน้า QR Code ประจำโต๊ะ (พนักงาน): สร้างและพิมพ์ QR ของทุกโต๊ะ ลูกค้าสแกนแล้วเข้าหน้าสั่งอาหารของโต๊ะนั้น
import { useTables } from '../../../controllers/useTables'
import { useQrBaseUrl } from '../../../controllers/useQrBaseUrl'
import TableQrCard from '../../components/table/TableQrCard'
import Button from '../../components/common/Button'
import { ErrorState, LoadingState } from '../../components/common/StateMessages'

export default function TableQrPage() {
  const { tables, loading, error } = useTables()
  const { baseUrl, setBaseUrl, addresses, valid } = useQrBaseUrl()

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h1 className="text-2xl font-bold">QR Code ประจำโต๊ะ</h1>
        <Button onClick={() => window.print()} disabled={!valid || tables.length === 0}>
          🖨️ พิมพ์ QR ทั้งหมด
        </Button>
      </div>

      <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-4 print:hidden">
        <div>
          <label htmlFor="qr-base-url">URL ของเว็บที่ลูกค้าจะเปิด</label>
          <input
            id="qr-base-url"
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            aria-invalid={!valid}
            placeholder="http://192.168.1.45:5173"
          />
        </div>

        {!valid && (
          <p role="alert" className="text-sm text-red-600">
            URL ไม่ถูกต้อง ต้องขึ้นต้นด้วย http:// หรือ https://
          </p>
        )}

        {addresses.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-stone-500">IP ของเครื่องนี้:</span>
            {addresses.map((address) => (
              <button
                key={address}
                type="button"
                className="rounded-full bg-stone-100 px-3 py-1 hover:bg-stone-200"
                onClick={() => setBaseUrl(`${window.location.protocol}//${address}${window.location.port ? `:${window.location.port}` : ''}`)}
              >
                {address}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-stone-500">
          โทรศัพท์ต้องต่อ Wi-Fi วงเดียวกับเครื่องนี้ และไม่ควรเป็น localhost · ถ้าใช้ tunnel ให้วาง URL ที่ได้ลงช่องด้านบน
        </p>
      </section>

      {loading && <LoadingState text="กำลังโหลดโต๊ะ..." />}
      {error && <ErrorState message={error} />}

      {valid && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-3">
          {tables.map((table) => (
            <TableQrCard key={table.id} table={table} baseUrl={baseUrl} />
          ))}
        </div>
      )}
    </div>
  )
}
