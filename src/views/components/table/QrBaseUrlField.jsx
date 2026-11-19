import { CircleAlert, Link2, Wifi } from 'lucide-react'

/** ช่องตั้ง URL หลักที่ใส่ใน QR (เริ่มจาก IP ของเครื่อง แก้เองได้ เช่น URL ของ tunnel) */
export default function QrBaseUrlField({ baseUrl, onChange, addresses, valid }) {
  return (
    <section className="card bg-base-100">
      <div className="card-body gap-3 p-4 sm:p-5">
        <fieldset className="fieldset p-0">
          <label htmlFor="qr-base-url" className="fieldset-legend pt-0">
            URL ของเว็บที่ใส่ใน QR
          </label>
          <label className={`input w-full max-sm:min-h-11 ${valid ? '' : 'input-error'}`}>
            <Link2 size={16} className="opacity-50" aria-hidden="true" />
            <input
              id="qr-base-url"
              type="url"
              value={baseUrl}
              onChange={(e) => onChange(e.target.value)}
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
                className="btn btn-sm btn-outline rounded-full border-base-300 max-sm:min-h-11"
                onClick={() => onChange(`${window.location.protocol}//${address}${window.location.port ? `:${window.location.port}` : ''}`)}
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
  )
}
