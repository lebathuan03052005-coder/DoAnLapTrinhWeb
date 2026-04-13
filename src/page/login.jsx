import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Giả lập kiểm tra đăng nhập
    if (email === "admin@gmail.com" && password === "123456") {
      navigate("/admin"); // Chuyển hướng vào trang quản trị
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
          <h2>QUẢN TRỊ VIÊN</h2>
          <p>Vui lòng đăng nhập để quản lý hệ thống</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" /> Ghi nhớ đăng nhập
            </label>
            <a href="#">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="login-button">
            ĐĂNG NHẬP
          </button>
        </form>

        <div className="login-footer">
          <p>
            Bạn không có quyền truy cập? <a href="/">Quay lại trang chủ</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
