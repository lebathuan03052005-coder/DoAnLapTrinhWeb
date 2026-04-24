import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Giả lập kiểm tra đăng nhập
    if (email === "admin@gmail.com" && password === "123456") {
      navigate("/admin"); // Dùng useNavigate để điều hướng bằng code
    } else {
      alert(
        "Tài khoản hoặc mật khẩu không đúng! (Thử: admin@gmail.com / 123456)",
      );
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>BOOKING.Commm</h2>
          <p>Chào mừng bạn đến với BOOKING.Commm</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Nhập email của bạn..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
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
            <Link to="/login_admin">Đăng nhập quản trị viên</Link>
          </div>

          <button type="submit" className="login-button">
            ĐĂNG NHẬP
          </button>
        </form>

        <div className="login-footer">
          <p>
            Bạn không có quyền truy cập? <Link to="/">Quay lại trang chủ</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
