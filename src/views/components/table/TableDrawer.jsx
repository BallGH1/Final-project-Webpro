import { X } from 'lucide-react'
import Modal from '../common/Modal'
import TableCard from './TableCard'

/**
 * แผงรายละเอียดเมื่อแตะโต๊ะบนผังร้าน (มือถือ/iPad เลื่อนขึ้นจากล่าง, คอมขึ้นกลางจอ)
 * ใช้การ์ดโต๊ะตัวเดิม จึงมีปุ่ม เปิดโต๊ะ / QR / บิล ครบเหมือนมุมมองรายการ
 */
export default function TableDrawer({ table, busy, onOpen, onShowQr, onAcknowledge, onClose }) {
  return (
    <Modal onClose={onClose} labelledBy="table-drawer-title" boxClassName="max-w-sm p-3">
      {(close) => (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2 pt-1">
            <h2 id="table-drawer-title" className="text-lg font-semibold">
              โต๊ะ {table.id}
            </h2>
            <button type="button" className="btn btn-ghost btn-circle max-sm:size-11" onClick={close} aria-label="ปิด">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <TableCard table={table} busy={busy} onOpen={onOpen} onShowQr={onShowQr} onAcknowledge={onAcknowledge} />
        </div>
      )}
    </Modal>
  )
}
