import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

// Sử dụng biến môi trường, fallback về localhost chỉ khi chạy ở máy local
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    console.log("Đang gửi yêu cầu tới:", `${API_URL}/customer-login`); // Debug URL

    try {
      const response = await fetch(`${API_URL}/customer-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("isCustomerLoggedIn", "true");
        localStorage.setItem("customerName", data.user.full_name);
        window.dispatchEvent(new Event("userChanged"));
        navigate("/");
      } else {
        // Thông báo lỗi cụ thể từ Server
        alert(
          data.message ||
            "Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!",
        );
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không kết nối được server. Hãy kiểm tra tab Network trong F12.");
    }
  };

  return (
    // ... giữ nguyên phần return bên dưới của bạn
    <div className="login-wrapper">
      <div className="login-card">
        {/* ... giữ nguyên nội dung form */}
        <form className="login-form" onSubmit={handleCustomerLogin}>
          {/* ... các input email/password của bạn */}
          <button type="submit" className="login-button">
            ĐĂNG NHẬP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
