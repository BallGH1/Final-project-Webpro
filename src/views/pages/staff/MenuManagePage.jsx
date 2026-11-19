// หน้าจัดการเมนู (พนักงาน): เพิ่ม / แก้ไข / ลบ / เปิด-ปิดการขาย
import { useState } from 'react'
import { Pencil, Plus, SearchX, Trash2, X } from 'lucide-react'
import { useMenuFilter } from '../../../controllers/useMenu'
import { useMenuManager } from '../../../controllers/useMenuManager'
import MenuForm from '../../components/menu/MenuForm'
import DeleteMenuModal from '../../components/menu/DeleteMenuModal'
import Modal from '../../components/common/Modal'
import SearchBar from '../../components/menu/SearchBar'
import CategoryTabs from '../../components/menu/CategoryTabs'
import Button from '../../components/common/Button'
import FoodImage from '../../components/common/FoodImage'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateMessages'
import { formatMoney } from '../../../models/formatters'

export default function MenuManagePage() {
  const { menu, categories, loading, error, reload, saving, addItem, editItem, removeItem, toggleAvailable } =
    useMenuManager()
  const { query, setQuery, categoryId, setCategoryId, filtered } = useMenuFilter(menu)
  // null = ปิดฟอร์ม, 'new' = เพิ่มเมนูใหม่, object = เมนูที่กำลังแก้ไข
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null) // เมนูที่กำลังยืนยันลบ (null = ปิดหน้าต่าง)
  const [actionError, setActionError] = useState('')

  const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? '-'

  async function handleSubmit(form) {
    if (editing === 'new') await addItem(form)
    else await editItem(editing.id, form)
    setEditing(null)
  }

  async function runAction(action) {
    setActionError('')
    try {
      await action()
    } catch (err) {
      setActionError(err.message)
    }
  }

  // error จะโยนกลับไปให้หน้าต่างยืนยันลบแสดง
  async function handleDelete() {
    await removeItem(deleting.id)
    setDeleting(null)
  }

  if (loading) return <LoadingState text="กำลังโหลดเมนู..." />
  if (error) return <ErrorState message={error} onRetry={reload} />

  const availableToggle = (item) => (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="toggle toggle-success toggle-sm"
        checked={item.available}
        disabled={saving}
        onChange={() => runAction(() => toggleAvailable(item))}
        aria-label={`เปิดขาย ${item.name}`}
      />
      <span className={item.available ? '' : 'text-base-content/50'}>{item.available ? 'เปิดขาย' : 'หมด'}</span>
    </label>
  )

  const rowActions = (item) => (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        className="btn btn-ghost btn-sm btn-square max-sm:size-11"
        onClick={() => setEditing(item)}
        aria-label={`แก้ไข ${item.name}`}
      >
        <Pencil size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-sm btn-square text-error max-sm:size-11"
        disabled={saving}
        onClick={() => setDeleting(item)}
        aria-label={`ลบ ${item.name}`}
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">จัดการเมนู</h1>
          <p className="text-sm text-base-content/60">ทั้งหมด {menu.length} เมนู</p>
        </div>
        <Button onClick={() => setEditing('new')}>
          <Plus size={16} aria-hidden="true" />
          เพิ่มเมนู
        </Button>
      </div>

      <SearchBar value={query} onChange={setQuery} />
      <CategoryTabs categories={categories} value={categoryId} onChange={setCategoryId} />
      {actionError && <ErrorState message={actionError} />}

      {filtered.length === 0 ? (
        <EmptyState icon={SearchX} title="ไม่พบเมนู" />
      ) : (
        <>
          {/* จอ md ขึ้นไป: ตาราง (table-zebra แบบ Lab 11) */}
          <div className="hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 md:block">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>เมนู</th>
                  <th>หมวดหมู่</th>
                  <th className="text-right">ราคา</th>
                  <th>สถานะ</th>
                  <th className="text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="flex items-center gap-3 font-medium">
                        <FoodImage
                          name={item.name}
                          emoji={item.image}
                          categoryId={item.categoryId}
                          iconSize={18}
                          className="size-10 rounded-lg"
                        />
                        {item.name}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-outline badge-sm">{categoryName(item.categoryId)}</span>
                    </td>
                    <td className="text-right tabular-nums">{formatMoney(item.price)}</td>
                    <td>{availableToggle(item)}</td>
                    <td>{rowActions(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* มือถือ: เป็นรายการการ์ด อ่านง่ายกว่าตารางที่ต้องเลื่อนข้าง */}
          <ul className="space-y-2 md:hidden">
            {filtered.map((item) => (
              <li key={item.id} className="flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-3">
                <FoodImage
                  name={item.name}
                  emoji={item.image}
                  categoryId={item.categoryId}
                  iconSize={20}
                  className="size-12 rounded-xl"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate font-medium">{item.name}</p>
                  <p className="text-xs text-base-content/60">
                    {categoryName(item.categoryId)} · {formatMoney(item.price)}
                  </p>
                  {availableToggle(item)}
                </div>
                {rowActions(item)}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Modal เพิ่ม/แก้ไขเมนู (modal ของ DaisyUI แบบ Lab 11 ผ่าน component Modal กลาง) */}
      {editing && (
        <Modal
          onClose={() => setEditing(null)}
          locked={saving}
          labelledBy="menu-modal-title"
          boxClassName="max-h-[90vh] max-w-2xl"
        >
          {(close) => (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-circle absolute top-3 right-3 max-sm:size-11"
                onClick={close}
                aria-label="ปิด"
              >
                <X size={18} aria-hidden="true" />
              </button>
              <h2 id="menu-modal-title" className="mb-2 text-xl font-semibold">
                {editing === 'new' ? 'เพิ่มเมนูใหม่' : `แก้ไข: ${editing.name}`}
              </h2>
              <MenuForm
                key={editing === 'new' ? 'new' : editing.id}
                categories={categories}
                initialValue={editing === 'new' ? null : editing}
                saving={saving}
                onSubmit={handleSubmit}
                onCancel={close}
              />
            </>
          )}
        </Modal>
      )}

      {deleting && (
        <DeleteMenuModal
          item={deleting}
          categoryName={categoryName(deleting.categoryId)}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
