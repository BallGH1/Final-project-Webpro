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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* ฝั่งลูกค้า: URL นี้คือสิ่งที่อยู่ใน QR Code ของแต่ละโต๊ะ */}
      <Route path="/table/:tableId" element={<CustomerLayout />}>
        <Route index element={<MenuPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={<OrderStatusPage />} />
      </Route>

      {/* ฝั่งพนักงาน (หลังบ้าน) */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<OrderBoardPage />} />
        <Route path="menu" element={<MenuManagePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
