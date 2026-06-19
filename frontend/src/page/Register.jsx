import React, { useState } from "react";
import "./register.css";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",

          text: data.message || "Đăng ký thành công!",
        });

        setFullName("");

        setEmail("");

        setPhone("");

        setPassword("");
      } else {
        setMessage({
          type: "error",

          text: data.message || "Đăng ký thất bại",
        });
      }
    } catch {
      setMessage({
        type: "error",

        text: "Không kết nối được server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h2>BOOKING.COMMM</h2>

          <p>Chào mừng bạn đến với hệ thống</p>
        </div>

        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Họ và tên</label>

            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ tên"
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Số điện thoại</label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button className="register-button" type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Đăng ký"}
          </button>
        </form>

        <div className="register-footer" style={{ paddingRight: "10px" }}>
          Đã có tài khoản?
          <a href="/login"> Đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
