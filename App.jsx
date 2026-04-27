import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import thư viện CSS (từ nhánh update)
import '@fortawesome/fontawesome-free/css/all.min.css';

// --- CÁC COMPONENT DÙNG CHUNG ---
import Navbar from "./components/Navbar";
import "./App.css"; // File này lúc nãy bạn đã xóa trắng ruột rồi, cứ để nguyên vậy nhé

// --- CÁC TRANG (PAGES) ---
import HomePage from "./page/home_page"; 
import SearchResults from "./page/giao_dien"; // Đây là trang danh sách bạn vừa làm
import HotelDetail from "./page/HotelDetail"; 
import Login from "./page/login";
import Admin from "./page/admin";
import AdminPanel from "./page/admin_panel";
import LoginAdmin from "./page/login_admin";
import Booking from "./page/Booking";

function App() {
  return (
    <Router>
      {/* Navbar để ở ngoài Routes để trang nào cũng hiện thanh menu này */}
      <Navbar />
      
      <Routes>
        {/* Đường dẫn trang chủ */}
        <Route path="/" element={<HomePage />} />
        
        {/* Đường dẫn trang danh sách khách sạn (bấm TÌM sẽ ra đây) */}
        <Route path="/search" element={<SearchResults />} /> 
        
        {/* Đường dẫn trang chi tiết khách sạn (bấm vào card khách sạn sẽ ra đây) */}
        <Route path="/hotel-detail" element={<HotelDetail />} /> 
        
        {/* Các trang khác của bạn */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/login_admin" element={<LoginAdmin />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Router>
  );
}

export default App;