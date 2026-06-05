import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import "./login_admin.css"; // Dùng file CSS riêng

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/admin-login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("isAdminLoggedIn", "true");

        localStorage.setItem("adminName", data.admin.full_name);

        navigate("/admin");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);

      alert("Không kết nối được server");
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group-admin">
            <label htmlFor="admin-password">Mật khẩu</label>
            <input
              id="admin-password"
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
