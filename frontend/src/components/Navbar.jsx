import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdminLoggedIn") === "true";
    const isCustomer = localStorage.getItem("isCustomerLoggedIn") === "true";

    if (isAdmin) {
      setUserType("admin");
      // Admin không cần tên trên Navbar nữa nhưng cứ giữ state nếu sau này cần dùng việc khác
      setUserName(localStorage.getItem("adminName") || "Admin");
    } else if (isCustomer) {
      setUserType("customer");
      setUserName(localStorage.getItem("customerName") || "Khách");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminName");
    localStorage.removeItem("isCustomerLoggedIn");
    localStorage.removeItem("customerName");

    setUserType(null);
    setUserName("");

    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="https://via.placeholder.com/120x40" alt="Logo" />
        </Link>
      </div>

      {/* Links */}
      <ul className="navbar-links">
        <li>
          <Link to="/">Khách Sạn</Link>
        </li>
        <li>
          <Link to="/">Homestay</Link>
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

      {/* Actions */}
      <div className="navbar-actions">
        {userType ? (
          <div className="user-logged-in">
            {/* CHỈ HIỂN THỊ LỜI CHÀO NẾU LÀ KHÁCH */}
            {userType === "customer" && (
              <span className="welcome-text">Chào, {userName}!</span>
            )}

            {/* NẾU LÀ ADMIN THÌ HIỂN THỊ NÚT QUẢN LÝ (KHÔNG CHÀO) */}
            {userType === "admin" && (
              <Link to="/admin">
                <button className="btn-admin-dashboard">Quản lý</button>
              </Link>
            )}

            <button className="btn-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        ) : (
          // KHI CHƯA ĐĂNG NHẬP
          <>
            <Link to="/login">
              <button className="btn-login">Đăng nhập</button>
            </Link>
            <Link to="/register">
              <button className="btn-signup">Đăng ký</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
