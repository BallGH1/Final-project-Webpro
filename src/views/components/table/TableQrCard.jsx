import { QRCodeSVG } from 'qrcode.react'
import { tableUrl } from '../../../models/tableModel'

/** การ์ด QR ของโต๊ะ 1 ใบ — ขนาดพอดีพิมพ์ตั้งโต๊ะ */
export default function TableQrCard({ table, baseUrl }) {
  const url = tableUrl(baseUrl, table.id)
  return (
    <article className="flex break-inside-avoid flex-col items-center rounded-xl border border-stone-300 bg-white p-4 text-center">
      <p className="text-sm font-semibold text-brand">🍲 Suki Teeyai</p>
      <h2 className="text-3xl font-bold">โต๊ะ {table.id}</h2>
      <div className="my-3 rounded-lg bg-white p-2">
        <QRCodeSVG value={url} size={160} level="M" title={`QR Code โต๊ะ ${table.id}`} />
      </div>
      <p className="text-sm font-medium">สแกนเพื่อสั่งอาหาร</p>
      <p className="mt-1 w-full text-[10px] break-all text-stone-400 print:hidden">{url}</p>
    </article>
  )
}
