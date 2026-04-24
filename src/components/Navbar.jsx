import React from "react";
import { Link } from "react-router-dom";
// import Login from "../page/login"; // Xóa nếu không dùng trực tiếp trong Navbar
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="https://via.placeholder.com/120x40" alt="Logo" />
        </Link>
      </div>

      {/* Links - Đã chuyển sang Link để không bị load lại trang */}
      <ul className="navbar-links">
        <li>
          <Link to="/khach-san">Khách Sạn</Link>
        </li>
        <li>
          <Link to="/homestay">Homestay</Link>
        </li>

        <li className="dropdown">
          <Link to="/khac">
            Khác <span className="arrow">⌄</span>
          </Link>
        </li>

        <li>
          <Link to="/booking">Đặt Phòng</Link>
        </li>
        <li>
          <Link to="/search">Tìm Kiếm</Link>
        </li>
      </ul>

      {/* Button - Đã sửa lỗi viết hoa chữ Link */}
      <div className="navbar-actions">
        <Link to="/login">
          <button className="btn-login">Đăng nhập</button>
        </Link>
        <Link to="/register">
          <button className="btn-signup">Đăng ký</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
