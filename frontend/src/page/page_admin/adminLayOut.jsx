import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./adminLayout.css"; // Dùng file CSS riêng cho Layout Admin
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/hotels", label: "Quản lý khách sạn" },
    { path: "/admin/accounts", label: "Quản lý tài khoản" },
    { path: "/admin/change-password", label: "Đổi mật khẩu" },
  ];

  // Lấy tên admin từ localStorage khi vừa chuyển sang Layout này
  useEffect(() => {
    const storedName = localStorage.getItem("adminName");
    if (storedName) {
      setAdminName(storedName);
    }
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminName");
    navigate("/login_admin");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Khoảng trống trên cùng của menu như trong ảnh */}
        </div>
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <button className="nav-item logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </nav>
      </aside>

      {/* Phần nội dung chính bên phải */}
      <main className="main-wrapper">
        {/* Header */}
        <header className="top-header">
          <h2>Quản lý hệ thống</h2>
          <div className="user-greeting">
            Chào, Admin {adminName || "Thuần"}!
          </div>
        </header>

        {/* Nội dung thay đổi theo Route sẽ render ở đây */}
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
