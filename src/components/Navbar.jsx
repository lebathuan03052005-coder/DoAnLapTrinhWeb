import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img src="https://via.placeholder.com/120x40" alt="Logo" />
      </div>

      {/* Links */}
      <ul className="navbar-links">
        <li>
          <a href="#">Khách Sạn</a>
        </li>
        <li>
          <a href="#">Homestay</a>
        </li>

        <li className="dropdown">
          <a href="#">
            Khác <span className="arrow">⌄</span>
          </a>
        </li>

        <li>
          <a href="#">Đặt Phòng</a>
        </li>
        <li>
          <a href="#">Tìm Kiếm</a>
        </li>
      </ul>

      {/* Button */}
      <div className="navbar-actions">
        <button className="btn-login">Đăng nhập</button>
        <button className="btn-signup">Đăng ký</button>
      </div>
    </nav>
  );
};

export default Navbar;
