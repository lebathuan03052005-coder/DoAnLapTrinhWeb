import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: nhập email | 2: nhập mã + mật khẩu mới
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: "error", text: "Vui lòng nhập email!" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({
          type: "success",
          text: "Mã xác nhận đã được gửi! Vui lòng kiểm tra email (cả mục Spam).",
        });
        setStep(2);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Không thể gửi mã, vui lòng thử lại.",
        });
      }
    } catch (err) {
      console.error("Lỗi gửi mã:", err);
      setMessage({
        type: "error",
        text: "Lỗi kết nối tới hệ thống, vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!code || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin!" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp!" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({
          type: "success",
          text: "Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...",
        });
        setTimeout(() => navigate("/dang-nhap"), 1800);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Mã không đúng hoặc đã hết hạn.",
        });
      }
    } catch (err) {
      console.error("Lỗi đặt lại mật khẩu:", err);
      setMessage({
        type: "error",
        text: "Lỗi kết nối tới hệ thống, vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        <h2 className="fp-title">Khôi phục mật khẩu</h2>
        <p className="fp-subtitle">
          {step === 1
            ? "Nhập email tài khoản của bạn để nhận mã xác nhận."
            : `Nhập mã đã gửi tới ${email} và mật khẩu mới.`}
        </p>

        {message && (
          <div
            className={`fp-message ${
              message.type === "success"
                ? "fp-message-success"
                : "fp-message-error"
            }`}
          >
            {message.text}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="fp-form">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email đã đăng ký"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="fp-submit-btn" type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="fp-form">
            <label>Mã xác nhận (OTP)</label>
            <input
              type="text"
              placeholder="Nhập mã 6 số"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />

            <label>Mật khẩu mới</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="fp-submit-btn" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>

            <button
              type="button"
              className="fp-resend-btn"
              onClick={handleSendCode}
              disabled={loading}
            >
              Gửi lại mã
            </button>
          </form>
        )}

        <div className="fp-back-link" onClick={() => navigate("/login")}>
          ← Quay lại đăng nhập
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
