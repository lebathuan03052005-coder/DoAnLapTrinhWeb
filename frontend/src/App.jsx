import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import thư viện CSS (từ nhánh update)
import '@fortawesome/fontawesome-free/css/all.min.css';

// --- CÁC COMPONENT DÙNG CHUNG ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css"; // File này lúc nãy bạn đã xóa trắng ruột rồi, cứ để nguyên vậy nhé

// --- CÁC TRANG (PAGES) ---
import HomePage from "./page/home_page"; 
import SearchResults from "./page/giao_dien"; // Đây là trang danh sách bạn vừa làm
import HotelDetail from "./page/HotelDetail"; 
import Login from "./page/login";
import Admin from "./page/admin";
import LoginAdmin from "./page/login_admin";
import Booking from "./page/booking";
import Register from "./page/Register";
import BookingSuccess from './page/BookingSuccess';
import GuideDetail from "./page/GuideDetail";
import MyBookings from "./page/MyBookings";
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
        <Route path="/my-bookings" element={<MyBookings />} />
        {/* Các trang khác của bạn */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login_admin" element={<LoginAdmin />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/guide/:id" element={<GuideDetail />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;