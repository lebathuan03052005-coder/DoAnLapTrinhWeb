import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // --- LOGIC GIỮ NGUYÊN ---
  const loadUser = () => {
    const isAdmin = localStorage.getItem("isAdminLoggedIn") === "true";
    const isCustomer = localStorage.getItem("isCustomerLoggedIn") === "true";
    const isHost = localStorage.getItem("isHostLoggedIn") === "true";

    if (isAdmin) {
      setUserType("admin");
      setUserName(localStorage.getItem("adminName") || "Admin");
    } else if (isHost) {
      setUserType("host");
      setUserName(localStorage.getItem("hostName") || "Host");
    } else if (isCustomer) {
      setUserType("customer");
      setUserName(localStorage.getItem("customerName") || "Khách");
    } else {
      setUserType(null);
      setUserName("");
    }
  };

  useEffect(() => {
    loadUser();
    const refresh = () => loadUser();
    window.addEventListener("userChanged", refresh);
    return () => window.removeEventListener("userChanged", refresh);
  }, []);

  useEffect(() => {
    const outside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminName");
    localStorage.removeItem("isCustomerLoggedIn");
    localStorage.removeItem("customerName");
    localStorage.removeItem("isHostLoggedIn");
    localStorage.removeItem("hostName");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  };
  // -------------------------

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">LOGO</Link>
      </div>

      {/* Links - Cập nhật theo yêu cầu */}
      <ul className="navbar-links">
        <li>
          <Link to="/">Trang Chủ</Link>
        </li>
        <li>
          <Link to="/search">Khách Sạn</Link>
        </li>
        <li>
          <Link to="/guide/1">Hỗ Trợ</Link>
        </li>
        {/* Bổ sung link Đặt phòng của tôi nếu đã login */}
        {userType && (
          <li>
            <Link to="/my-bookings">Đặt Phòng Của Tôi</Link>
          </li>
        )}
      </ul>

      {/* RIGHT ACTIONS */}
      <div className="navbar-actions">
        {/* ADMIN */}
        {userType === "admin" && (
          <Link to="/admin">
            <button className="btn-admin-dashboard">Quản lý</button>
          </Link>
        )}

        {/* CUSTOMER + HOST */}
        {(userType === "customer" || userType === "host") && (
          <div className="account-dropdown" ref={dropdownRef}>
            <button
              className="account-trigger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="account-avatar">
                {userName?.charAt(0).toUpperCase()}
              </span>
              <span>{userName}</span>▼
            </button>

            {menuOpen && (
              <div className="account-menu">
                <Link to="/my-bookings">
                  <button>Đặt phòng của tôi</button>
                </Link>
                <button onClick={handleLogout}>Đăng xuất</button>
              </div>
            )}
          </div>
        )}

        {/* CHƯA LOGIN */}
        {!userType && (
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
