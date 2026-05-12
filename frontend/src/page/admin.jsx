import React from "react";
import "./admin.css";
const Admin = () => {
  return (
    <div className="admin-container">
      {/* Sidebar bên trái */}
      <aside className="admin-sidebar">
        <div className="admin-logo">ADMIN BOOKING</div>
        <ul className="admin-menu">
          <li className="active">
            <i className="icon"></i> Dashboard
          </li>
          <li>
            <i className="icon"></i> Quản lý khách sạn
          </li>
          <li>
            <i className="icon"></i> Quản lý tài khoản
          </li>
          <li>
            <i className="icon"></i> Đổi mật khẩu
          </li>
          <li className="logout">
            <i className="icon"></i> Đăng xuất
          </li>
        </ul>
      </aside>

      {/* Nội dung bên phải */}
      <main className="admin-content">
        <header className="admin-header">
          <h2>Quản lý hệ thống</h2>
          <div className="user-info">Chào, Admin Thuần!</div>
        </header>

        <section className="admin-main">
          {/* Đây là nơi bạn sẽ hiện Table hoặc Form tùy theo mục được chọn */}
          <div className="card">
            <h3>Danh sách các khách sạn</h3>
            <button className="btn-add">+ Thêm khách sạn mới</button>
            {/* Table sẽ nằm ở đây */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
