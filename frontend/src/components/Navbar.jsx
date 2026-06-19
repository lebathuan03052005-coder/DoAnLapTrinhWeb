import React from "react";
import { Link } from "react-router-dom";
// import Login from "../page/login"; // Xóa nếu không dùng trực tiếp trong Navbar
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        
      </div>

      {/* Links - Đã chuyển sang Link để không bị load lại trang */}
      <ul className="navbar-links">
        <li>
          <Link to="/">Trang Chủ</Link>
        </li>
        <li>
    <Link to="/search">Khách Sạn</Link>
  </li>
  
  <li><Link to="/guide/1">Hỗ Trợ</Link></li> 
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
