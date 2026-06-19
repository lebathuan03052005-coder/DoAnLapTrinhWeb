import React, { useState } from "react";
import "./register.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Register = () => {
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // =========================
  // 1. GỬI OTP
  // =========================
  const handleSendOtp = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Vui lòng nhập email" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);
        setMessage({ type: "success", text: "Đã gửi mã OTP về email!" });
      } else {
        setMessage({ type: "error", text: data.message || "Gửi OTP thất bại" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Không kết nối được server" });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 2. XÁC NHẬN OTP + ĐĂNG KÝ
  // =========================
  const handleVerifyOtpAndRegister = async () => {
    if (!otp) {
      setMessage({ type: "error", text: "Vui lòng nhập OTP" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/verify-otp-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          password,
          otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Đăng ký thành công!" });

        // reset form
        setStep(1);
        setFullName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setOtp("");
      } else {
        setMessage({ type: "error", text: data.message || "OTP sai" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Lỗi server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h2>BOOKING SYSTEM</h2>
          <p>Đăng ký tài khoản</p>
        </div>

        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="register-form">
            <input
              placeholder="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="register-button"
            >
              {loading ? "Đang gửi OTP..." : "Gửi mã OTP"}
            </button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="register-form">
            <p>Nhập mã OTP đã gửi về email: {email}</p>

            <input
              placeholder="Mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOtpAndRegister}
              disabled={loading}
              className="register-button"
            >
              {loading ? "Đang xác nhận..." : "Xác nhận & Đăng ký"}
            </button>

            <button onClick={() => setStep(1)} className="back-button">
              Quay lại
            </button>
          </div>
        )}

        <div className="register-footer">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
