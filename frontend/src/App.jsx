import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// --- CSS ---
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

// --- COMPONENTS ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// --- TRANG CÔNG KHAI (USER) ---
import HomePage from "./page/home_page";
import SearchResults from "./page/giao_dien";
import HotelDetail from "./page/HotelDetail";
import Login from "./page/login";
import Register from "./page/Register";
import BookingForm from "./page/booking"; // Trang đặt phòng
import BookingSuccess from "./page/BookingSuccess";
import MyBookings from "./page/MyBookings";
import GuideDetail from "./page/GuideDetail";
import ForgotPassword from "./page/ForgotPassword";
import BookingsList from "./page/BookingsList";
import MyBookings2 from "./page/MyBookings2";
import HotelManagement from "./page/HotelManagement";
import BookingActions from "./page/BookingActions";
import BookingManagement from "./page/BookingManagement";

// --- TRANG QUẢN TRỊ (ADMIN) ---
import AdminLayout from "./page/page_admin/adminLayOut";
import Dashboard from "./page/page_admin/Dashboard";
import Hotels from "./page/page_admin/Hotels";
import Accounts from "./page/page_admin/Accounts";
import ChangePassword from "./page/page_admin/ChangePassword";
import LoginAdmin from "./page/page_admin/login_admin";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* --- ROUTES NGƯỜI DÙNG --- */}
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/hotel-detail" element={<HotelDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/guide/:id" element={<GuideDetail />} />
        <Route path="/bookingsList" element={<BookingsList />} />
        <Route path="/mybookings2" element={<MyBookings2 />} />
        <Route path="/hotelManagement" element={<HotelManagement />} />
        <Route path="/bookingAction" element={<BookingActions />} />
        <Route path="/bookingManagement" element={<BookingManagement />} />
        <Footer />
        {/* --- ROUTES ADMIN --- */}
        <Route path="/login_admin" element={<LoginAdmin />} />
        <Route path="/admin" element={<AdminLayout />}>
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
