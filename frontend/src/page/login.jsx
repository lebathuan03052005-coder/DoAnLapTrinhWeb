import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

// TỰ ĐỘNG CHUYỂN ĐỔI URL:
// Nếu có biến VITE_API_URL trong môi trường, dùng nó.
// Nếu không, mặc định dùng localhost:5000 cho lúc bạn code ở nhà.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleCustomerLogin = async (e) => {
    e.preventDefault();

    try {
      // Dùng API_URL thay vì localhost cứng
      const response = await fetch(`${API_URL}customer-login`, {
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

      if (response.ok && data.success) {
        localStorage.setItem("isCustomerLoggedIn", "true");
        localStorage.setItem("customerName", data.user.full_name);
        window.dispatchEvent(new Event("userChanged"));
        navigate("/");
      } else {
        alert(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không kết nối được server");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>BOOKING.Commm</h2>
          <p>Chào mừng bạn đến với BOOKING.Commm</p>
        </div>

        <form className="login-form" onSubmit={handleCustomerLogin}>
          <div className="input-group">
            <label htmlFor="email">Email của bạn</label>
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
            <label
              className="remember-me"
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                style={{ width: "20px", height: "18px" }}
              />
              <span>Ghi nhớ</span>
            </label>

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
