import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp, vui lòng nhập lại!");
      return;
    }

    // Nhập lại email admin
    const adminEmail = prompt("Vui lòng nhập lại Email Admin:");

    if (!adminEmail) return;

    try {
      const response = await fetch(`${API_URL}/api/change-admin-password`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: adminEmail,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      alert(data.message);

      if (data.success) {
        localStorage.removeItem("isAdminLoggedIn");

        localStorage.removeItem("adminName");

        navigate("/login_admin");
      }
    } catch (error) {
      console.error(error);

      alert("Lỗi kết nối với máy chủ!");
    }
  };

  return (
    <div className="change-password-container">
      <h3 className="change-password-title">Đổi Mật Khẩu Quản Trị Viên</h3>

      <form onSubmit={handleChangePassword} className="change-password-form">
        {/* Mật khẩu cũ */}
        <div className="form-group">
          <label>Mật khẩu hiện tại:</label>

          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        {/* Mật khẩu mới */}
        <div className="form-group">
          <label>Mật khẩu mới:</label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="form-group">
          <label>Xác nhận mật khẩu mới:</label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="change-password-btn">
          XÁC NHẬN ĐỔI MẬT KHẨU
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
