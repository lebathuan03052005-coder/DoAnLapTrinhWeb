import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./adminLayOut.css";

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

  useEffect(() => {
    const loadAdmin = () => {
      const isLogin = localStorage.getItem("isAdminLoggedIn") === "true";

      if (!isLogin) {
        navigate("/login_admin");
        return;
      }

      setAdminName(localStorage.getItem("adminName") || "Admin");
    };

    loadAdmin();

    window.addEventListener("userChanged", loadAdmin);

    return () => {
      window.removeEventListener("userChanged", loadAdmin);
    };
  }, [navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc muốn đăng xuất?");

    if (!confirmLogout) return;

    // Xóa trạng thái đăng nhập
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminName");

    // Phòng trường hợp đang lưu customer
    localStorage.removeItem("isCustomerLoggedIn");
    localStorage.removeItem("customerName");

    // Báo toàn app cập nhật
    window.dispatchEvent(new Event("userChanged"));

    // Điều hướng
    navigate("/login_admin", {
      replace: true,
    });
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-header"></div>

        <nav className="nav-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

          <button className="nav-item logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </nav>
      </aside>

      <main className="main-wrapper">
        <header className="top-header">
          <h2>Quản lý hệ thống</h2>

          <div className="user-greeting">Chào, Admin {adminName}!</div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
