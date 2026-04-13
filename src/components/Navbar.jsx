import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="" alt="Logo" />
      </div>

      <ul className="navbar-links">
        <li className="nav-item">
          <a href="#">Khách Sạn</a>
        </li>
        <li className="nav-item">
          <a href="#">Homestay</a>
        </li>
        <li className="nav-item">
          <a href="#">
            <i className="arrow-down"></i>
          </a>
        </li>
        <li className="nav-item">
          <a href="#">Hoạt động</a>
        </li>
        <li className="nav-item">
          <a href="#">Phiếu giảm giá và ưu đãi</a>
        </li>
        <li className="nav-item">
          <a href="#">Đặt Phòng</a>
        </li>
        <li className="nav-item">
          <a href="#">Tìm Kiếm Khách Sạn theo ý muốn</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
