import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import "./login_admin.css"; // Dùng file CSS riêng

const LoginAdmin = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();

    // XỬ LÝ LOGIC ĐĂNG NHẬP ADMIN TẠI ĐÂY
    // Giả lập check quyền Admin tối cao
    if (
      adminEmail === "thuansu@theking.com" &&
      adminPassword === "supersecret"
    ) {
      //  Mẹo: Lưu trạng thái đăng nhập vào LocalStorage
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminName", "Sếp Thuần");

      console.log("Chào sếp Thuần đã trở lại!");
      navigate("/admin"); // Đẩy vào Dashboard quản trị
    } else {
      alert(" Tài khoản hoặc mật khẩu Admin không chính xác!");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        {/* Phần Header quyền lực */}
        <div className="login-header">
          <h2>BOOKING.Commm</h2>
          <p>Chào mừng bạn đến với BOOKING.Commm</p>
        </div>
        {/* Form Đăng nhập bảo mật */}
        <form className="admin-login-form" onSubmit={handleAdminLogin}>
          <div className="input-group-admin">
            <label htmlFor="admin-email">Tài khoản Admin (Email)</label>
            <input
              id="admin-email"
              type="email"
              placeholder="Nhập email quản trị..."
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group-admin">
            <label htmlFor="admin-password">Mật khẩu</label>
            <input
              id="admin-password"
              type="password"
              placeholder="Nhập mật khẩu..."
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-options">
            <label>
              <input type="checkbox" /> Ghi nhớ đăng nhập
            </label>
            {/* Thẻ Link này cần được import ở dòng 3 */}
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          <button type="submit" className="admin-login-button">
            XÁC THỰC QUYỀN TRUY CẬP
          </button>
        </form>

        {/* Link quay lại dành cho khách lỡ tay bấm nhầm */}
        <div className="admin-login-footer">
          <p>
            Bạn không phải Admin?{" "}
            <Link to="/login">Quay lại trang Đăng nhập Khách</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
