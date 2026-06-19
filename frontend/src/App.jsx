import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import thư viện CSS (từ nhánh update)
import "@fortawesome/fontawesome-free/css/all.min.css";

// --- CÁC COMPONENT DÙNG CHUNG ---
import Navbar from "./components/Navbar";
import "./App.css";
// --- CÁC TRANG (PAGES) ---
// Thêm vào phần import admin pages
import HotelManagement from "./page/page_admin/HotelManagement";
import HomePage from "./page/home_page";
import SearchResults from "./page/giao_dien";
import Booking from "./page/booking";
import Register from "./page/Register";
import Login from "./page/login";
import HotelDetail from "./page/HotelDetail";
// --- CÁC TRANG LIÊN QUAN ĐẾN QUẢN TRỊ VIÊN ---
import Profile from './page/Profile';
import AdminLayout from "./page/page_admin/adminLayOut";
import Dashboard from "./page/page_admin/Dashboard";
import Hotels from "./page/page_admin/Hotels";
import Accounts from "./page/page_admin/Accounts";
import ChangePassword from "./page/page_admin/ChangePassword";
import LoginAdmin from "./page/page_admin/login_admin";

function App() {
  return (
    <Router>
      {/* Navbar để ở ngoài Routes để trang nào cũng hiện thanh menu này */}
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Đường dẫn trang danh sách khách sạn (bấm TÌM sẽ ra đây) */}
        <Route path="/search" element={<SearchResults />} />

        {/* Đường dẫn trang chi tiết khách sạn (bấm vào card khách sạn sẽ ra đây) */}
        <Route path="/hotel-detail" element={<HotelDetail />} />

        {/* Các trang khác của bạn */}
        <Route
path="/profile"
element={<Profile/>}
/>
        <Route path="/login" element={<Login />} />
        <Route path="/login_admin" element={<LoginAdmin />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hotel-management" element={<HotelManagement />} />
        {/* Khu vực quản trị Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Mặc định chuyển hướng vào dashboard */}
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
