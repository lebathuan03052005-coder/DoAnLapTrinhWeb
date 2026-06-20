import React, { useState } from "react";
import "./forgotPassword.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://doanlaptrinhweb-4n3f.onrender.com";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleResetPassword = async () => {
    if (!email || !newPassword) {
      setMessage({
        type: "error",
        text: "Vui lòng nhập email và mật khẩu mới",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không trùng" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || "Đổi mật khẩu thành công",
        });
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({
          type: "error",
          text: data.message || "Thao tác thất bại",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Lỗi server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-card">
        <h2 className="fp-title">Đặt lại mật khẩu</h2>
        <p className="fp-subtitle">Nhập thông tin để cập nhật mật khẩu mới</p>

        {/* Hiển thị thông báo (thành công/lỗi) */}
        {message && (
          <div className={`fp-message ${message.type}`}>{message.text}</div>
        )}

        <div className="fp-form">
          {/* Input Email */}
          <div className="fp-field">
            <label>Email tài khoản</label>
            <input
              className="fp-input"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Input Mật khẩu mới */}
          <div className="fp-field">
            <label>Mật khẩu mới</label>
            <input
              className="fp-input"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Input Xác nhận */}
          <div className="fp-field">
            <label>Xác nhận mật khẩu</label>
            <input
              className="fp-input"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Nút hành động */}
          <button
            className="fp-button"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
