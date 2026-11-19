import { QRCodeSVG } from 'qrcode.react'
import { ScanLine, Soup } from 'lucide-react'

/** การ์ด QR ของบิล 1 ใบ — ขนาดพอดีพิมพ์เป็นสลิปให้ลูกค้า (พื้นขาวเสมอ เหมือนกระดาษ) */
export default function TableQrCard({ tableId, billNo, url }) {
  return (
    <article className="flex break-inside-avoid flex-col items-center overflow-hidden rounded-box border border-stone-200 bg-white text-center text-stone-900 shadow-sm">
      <p className="flex w-full items-center justify-center gap-1.5 bg-[oklch(51%_0.19_27)] py-2 text-sm font-semibold text-white">
        <Soup size={16} aria-hidden="true" />
        Suki Teeyai
      </p>
      <div className="flex w-full flex-col items-center p-4">
        <h2 className="font-display text-3xl font-semibold">โต๊ะ {tableId}</h2>
        <p className="text-xs text-stone-500">บิล {billNo}</p>
        <div className="my-3 rounded-lg bg-white p-2 ring-1 ring-stone-200">
          <QRCodeSVG value={url} size={180} level="M" title={`QR Code โต๊ะ ${tableId}`} className="h-auto w-full max-w-[180px]" />
        </div>
        <p className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap">
          <ScanLine size={14} className="shrink-0" aria-hidden="true" />
          สแกนเพื่อสั่งอาหาร
        </p>
        <p className="mt-1 text-[11px] text-stone-500">QR นี้ใช้ได้เฉพาะรอบนี้ ปิดบิลแล้วจะใช้ไม่ได้</p>
        <p className="mt-1 w-full text-[10px] break-all text-stone-400 print:hidden">{url}</p>
      </div>
    </article>
  )
}
