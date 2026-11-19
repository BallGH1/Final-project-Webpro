// หน้าจัดการเมนู (พนักงาน): เพิ่ม / แก้ไข / ลบ / เปิด-ปิดการขาย
import { useState } from 'react'
import { useMenuFilter } from '../../../controllers/useMenu'
import { useMenuManager } from '../../../controllers/useMenuManager'
import MenuForm from '../../components/menu/MenuForm'
import SearchBar from '../../components/menu/SearchBar'
import CategoryTabs from '../../components/menu/CategoryTabs'
import Button from '../../components/common/Button'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateMessages'
import { formatMoney } from '../../../models/formatters'

export default function MenuManagePage() {
  const { menu, categories, loading, error, reload, saving, addItem, editItem, removeItem, toggleAvailable } =
    useMenuManager()
  const { query, setQuery, categoryId, setCategoryId, filtered } = useMenuFilter(menu)
  // null = ปิดฟอร์ม, 'new' = เพิ่มเมนูใหม่, object = เมนูที่กำลังแก้ไข
  const [editing, setEditing] = useState(null)
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

  function handleDelete(item) {
    if (!window.confirm(`ลบเมนู "${item.name}" ใช่หรือไม่?`)) return
    runAction(() => removeItem(item.id))
  }

  if (loading) return <LoadingState text="กำลังโหลดเมนู..." />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">จัดการเมนู ({menu.length})</h1>
        <Button onClick={() => setEditing('new')}>+ เพิ่มเมนู</Button>
      </div>

      {editing && (
        <section className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold">{editing === 'new' ? 'เพิ่มเมนูใหม่' : `แก้ไข: ${editing.name}`}</h2>
          <MenuForm
            key={editing === 'new' ? 'new' : editing.id}
            categories={categories}
            initialValue={editing === 'new' ? null : editing}
            saving={saving}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        </section>
      )}

      <SearchBar value={query} onChange={setQuery} />
      <CategoryTabs categories={categories} value={categoryId} onChange={setCategoryId} />
      {actionError && <ErrorState message={actionError} />}

      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="ไม่พบเมนู" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-stone-100 text-xs text-stone-500">
              <tr>
                <th className="p-3">เมนู</th>
                <th className="p-3">หมวดหมู่</th>
                <th className="p-3 text-right">ราคา</th>
                <th className="p-3">สถานะ</th>
                <th className="p-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="p-3 font-medium">
                    {item.image} {item.name}
                  </td>
                  <td className="p-3 text-stone-500">{categoryName(item.categoryId)}</td>
                  <td className="p-3 text-right">{formatMoney(item.price)}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => runAction(() => toggleAvailable(item))}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.available ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {item.available ? 'เปิดขาย' : 'หมด'}
                    </button>
                  </td>
                  <td className="space-x-1 p-3 text-right whitespace-nowrap">
                    <Button size="sm" variant="secondary" onClick={() => setEditing(item)}>
                      แก้ไข
                    </Button>
                    <Button size="sm" variant="danger" disabled={saving} onClick={() => handleDelete(item)}>
                      ลบ
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
