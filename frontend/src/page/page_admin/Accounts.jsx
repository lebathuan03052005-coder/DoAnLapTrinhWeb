import React, { useState, useEffect } from "react";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      // Lấy danh sách tài khoản kết nối Database từ Backend API
      const response = await fetch("http://localhost:5000/api/accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách tài khoản:", error);
    }
  };

  return (
    <div className="admin-accounts-container">
      <h3>Quản lý Tài khoản</h3>
      <div className="table-responsive">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            background: "white",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#111827",
                color: "white",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Họ Tên</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>SĐT</th>
              <th style={{ padding: "12px" }}>Vai trò</th>
              <th style={{ padding: "12px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{acc.id}</td>
                <td style={{ padding: "12px", fontWeight: "600" }}>
                  {acc.full_name}
                </td>
                <td style={{ padding: "12px" }}>{acc.email}</td>
                <td style={{ padding: "12px" }}>{acc.phone}</td>
                <td style={{ padding: "12px" }}>{acc.role}</td>
                <td style={{ padding: "12px" }}>
                  <button
                    style={{
                      marginRight: "10px",
                      padding: "6px 12px",
                      cursor: "pointer",
                      background: "#f59e0b",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    style={{
                      padding: "6px 12px",
                      cursor: "pointer",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounts;
