// หน้า QR Code ประจำโต๊ะ (พนักงาน): สร้างและพิมพ์ QR ของทุกโต๊ะ ลูกค้าสแกนแล้วเข้าหน้าสั่งอาหารของโต๊ะนั้น
import { CircleAlert, Link2, Printer, Wifi } from 'lucide-react'
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
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">QR Code ประจำโต๊ะ</h1>
          <p className="text-sm text-base-content/60">พิมพ์แล้ววางไว้ที่โต๊ะ ลูกค้าสแกนแล้วเข้าหน้าสั่งอาหารของโต๊ะนั้นทันที</p>
        </div>
        <Button onClick={() => window.print()} disabled={!valid || tables.length === 0}>
          <Printer size={16} aria-hidden="true" />
          พิมพ์ QR ทั้งหมด
        </Button>
      </div>

      <section className="card border border-base-300 bg-base-100 print:hidden">
        <div className="card-body gap-3 p-4 sm:p-5">
          <fieldset className="fieldset p-0">
            <label htmlFor="qr-base-url" className="fieldset-legend pt-0">
              URL ของเว็บที่ลูกค้าจะเปิด
            </label>
            <label className={`input w-full ${valid ? '' : 'input-error'}`}>
              <Link2 size={16} className="opacity-50" aria-hidden="true" />
              <input
                id="qr-base-url"
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                aria-invalid={!valid}
                placeholder="http://192.168.1.45:5173"
                className="grow"
              />
            </label>
          </fieldset>

          {!valid && (
            <p role="alert" className="flex items-center gap-1.5 text-sm text-error">
              <CircleAlert size={14} aria-hidden="true" />
              URL ไม่ถูกต้อง ต้องขึ้นต้นด้วย http:// หรือ https://
            </p>
          )}

          {addresses.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-base-content/60">IP ของเครื่องนี้:</span>
              {addresses.map((address) => (
                <button
                  key={address}
                  type="button"
                  className="btn btn-xs btn-outline rounded-full border-base-300"
                  onClick={() => setBaseUrl(`${window.location.protocol}//${address}${window.location.port ? `:${window.location.port}` : ''}`)}
                >
                  {address}
                </button>
              ))}
            </div>
          )}

          <p className="flex items-start gap-1.5 text-xs text-base-content/60">
            <Wifi size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            โทรศัพท์ต้องต่อ Wi-Fi วงเดียวกับเครื่องนี้ และไม่ควรเป็น localhost · ถ้าใช้ tunnel ให้วาง URL ที่ได้ลงช่องด้านบน
          </p>
        </div>
      </section>

      {loading && <LoadingState text="กำลังโหลดโต๊ะ..." />}
      {error && <ErrorState message={error} />}

      {valid && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 print:grid-cols-3">
          {tables.map((table) => (
            <TableQrCard key={table.id} table={table} baseUrl={baseUrl} />
          ))}
        </div>
      )}
    </div>
  )
}
