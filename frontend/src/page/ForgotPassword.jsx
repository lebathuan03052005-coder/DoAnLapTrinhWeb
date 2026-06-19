import React, { useState } from "react";
import "./forgotPassword.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ======================
  // 1. GỬI OTP RESET
  // ======================
  const handleSendOtp = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Vui lòng nhập email" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/send-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);
        setMessage({ type: "success", text: "OTP đã gửi về email!" });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Không kết nối được server" });
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // 2. RESET PASSWORD
  // ======================
  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      setMessage({ type: "error", text: "Nhập đầy đủ OTP và mật khẩu mới" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });

        // reset form
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2>Quên mật khẩu</h2>

        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="form">
            <input
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleSendOtp} disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="form">
            <p>OTP đã gửi về: {email}</p>

            <input
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button onClick={handleResetPassword} disabled={loading}>
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>

            <button className="back-btn" onClick={() => setStep(1)}>
              Quay lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
