import { QRCodeSVG } from 'qrcode.react'
import { ScanLine, Soup } from 'lucide-react'
import { tableUrl } from '../../../models/tableModel'

/** การ์ด QR ของโต๊ะ 1 ใบ — ขนาดพอดีพิมพ์ตั้งโต๊ะ (พื้นขาวเสมอ เหมือนกระดาษที่วางบนโต๊ะ) */
export default function TableQrCard({ table, baseUrl }) {
  const url = tableUrl(baseUrl, table.id)
  return (
    <article className="flex break-inside-avoid flex-col items-center overflow-hidden rounded-box border border-stone-200 bg-white text-center text-stone-900 shadow-sm">
      <p className="flex w-full items-center justify-center gap-1.5 bg-[oklch(51%_0.19_27)] py-2 text-sm font-semibold text-white">
        <Soup size={16} aria-hidden="true" />
        Suki Teeyai
      </p>
      <div className="flex w-full flex-col items-center p-3 sm:p-4">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">โต๊ะ {table.id}</h2>
        <div className="my-3 rounded-lg bg-white p-2 ring-1 ring-stone-200">
          <QRCodeSVG value={url} size={150} level="M" title={`QR Code โต๊ะ ${table.id}`} className="h-auto w-full max-w-[150px]" />
        </div>
        <p className="flex items-center gap-1 text-xs font-medium whitespace-nowrap sm:gap-1.5 sm:text-sm">
          <ScanLine size={14} className="shrink-0" aria-hidden="true" />
          สแกนเพื่อสั่งอาหาร
        </p>
        <p className="mt-1 w-full text-[10px] break-all text-stone-400 print:hidden">{url}</p>
      </div>
    </article>
  )
}
