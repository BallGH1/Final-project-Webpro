import { ExternalLink, Printer, X } from 'lucide-react'
import { customerPath } from '../../../models/sessionModel'
import { sessionUrl } from '../../../models/tableModel'
import Button from '../common/Button'
import Modal from '../common/Modal'
import TableQrCard from './TableQrCard'

/**
 * หน้าต่าง QR ของบิล (แสดงหลังเปิดโต๊ะ หรือกดปุ่ม QR)
 * พิมพ์ได้เฉพาะสลิป QR (ปุ่มและส่วนอื่นซ่อนตอนพิมพ์)
 */
export default function SessionQrModal({ session, baseUrl, onClose }) {
  const url = sessionUrl(baseUrl, session.token)

  return (
    <Modal
      onClose={onClose}
      labelledBy="qr-title"
      className="print:static print:bg-transparent"
      boxClassName="max-w-xs space-y-3 bg-transparent p-0 shadow-none print:mx-auto print:max-w-[260px]"
    >
      <h2 id="qr-title" className="sr-only">
        QR Code โต๊ะ {session.tableId}
      </h2>
      <TableQrCard tableId={session.tableId} billNo={session.billNo} url={url} />
      <div className="grid grid-cols-2 gap-2 print:hidden">
        <Button onClick={() => window.print()}>
          <Printer size={16} aria-hidden="true" />
          พิมพ์สลิป
        </Button>
        {/* สำหรับเดโมบนคอมเครื่องเดียว: เปิดหน้าลูกค้าของบิลนี้ในแท็บใหม่ */}
        <a href={customerPath(session.token)} target="_blank" rel="noreferrer" className="btn btn-outline border-base-300 bg-base-100">
          <ExternalLink size={16} aria-hidden="true" />
          หน้าลูกค้า
        </a>
        <Button variant="secondary" className="col-span-2" onClick={onClose}>
          <X size={16} aria-hidden="true" />
          ปิด
        </Button>
      </div>
    </Modal>
  )
}
