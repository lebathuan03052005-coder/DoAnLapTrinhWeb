import React, { useState } from "react";
import "./register.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [avatarDataUrl, setAvatarDataUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !password) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không trùng" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const body = {
        full_name: fullName,
        email,
        phone,
        password,
        bio,
        avatar: avatarDataUrl || undefined,
      };

      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || "Đăng ký thành công",
        });
        setFullName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setBio("");
        setAvatarDataUrl("");
      } else {
        setMessage({ type: "error", text: data.message || "Đăng ký thất bại" });
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

        <div className="register-form">
          <p> Nhập họ và tên của ban: </p>
          <input
            placeholder="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <p> Nhập vào Email của bạn: </p>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>Vui lòng nhập số điện thoại:</p>
          <input
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p> Nhập mật khẩu của bạn:</p>
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p>Xác nhận lại mật khẩu:</p>
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="register-button"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </div>

        <div className="register-footer">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
