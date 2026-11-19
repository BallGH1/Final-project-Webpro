import { Route, Routes } from 'react-router-dom'
import CustomerLayout from './views/layouts/CustomerLayout'
import StaffLayout from './views/layouts/StaffLayout'
import HomePage from './views/pages/HomePage'
import NotFoundPage from './views/pages/NotFoundPage'
import MenuPage from './views/pages/customer/MenuPage'
import CartPage from './views/pages/customer/CartPage'
import OrderStatusPage from './views/pages/customer/OrderStatusPage'
import OrderBoardPage from './views/pages/staff/OrderBoardPage'
import MenuManagePage from './views/pages/staff/MenuManagePage'
import TablesPage from './views/pages/staff/TablesPage'
import BillPage from './views/pages/staff/BillPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* ฝั่งลูกค้า: URL ใน QR Code ของบิล — token เปลี่ยนทุกครั้งที่เปิดโต๊ะใหม่ */}
      <Route path="/t/:token" element={<CustomerLayout />}>
        <Route index element={<MenuPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={<OrderStatusPage />} />
      </Route>

      {/* ฝั่งพนักงาน (หลังบ้าน) */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<OrderBoardPage />} />
        <Route path="menu" element={<MenuManagePage />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="tables/bill/:sessionId" element={<BillPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
