import React, { useState } from "react";
import "./forgotPassword.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    <div className="forgot-page">
      <div className="forgot-card">
        <h2>Đặt lại mật khẩu</h2>

        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <div className="form">
          <input
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
