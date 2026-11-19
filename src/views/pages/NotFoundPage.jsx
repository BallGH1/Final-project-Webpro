import Button from '../components/common/Button'
import { EmptyState } from '../components/common/StateMessages'

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <EmptyState
        icon="🤔"
        title="ไม่พบหน้าที่คุณต้องการ"
        text="ลิงก์อาจไม่ถูกต้อง หรือหน้านี้ถูกย้ายไปแล้ว"
        action={<Button to="/">กลับหน้าแรก</Button>}
      />
    </main>
  )
}
