import React, { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      // Lấy danh sách tài khoản kết nối Database từ Backend API
      const response = await fetch(`${API_URL}/api/accounts`);
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
              <React.Fragment key={acc.id}>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{acc.id}</td>
                  <td style={{ padding: "12px", fontWeight: "600" }}>
                    {acc.full_name}
                  </td>
                  <td style={{ padding: "12px" }}>{acc.email}</td>
                  <td style={{ padding: "12px" }}>{acc.phone}</td>
                  <td style={{ padding: "12px" }}>{acc.role}</td>
                  <td style={{ padding: "12px" }}>
                    <button
                      onClick={() => {
                        setEditingId(acc.id);
                        setEditValues({
                          full_name: acc.full_name || "",
                          email: acc.email || "",
                          phone: acc.phone || "",
                          role: acc.role || "",
                        });
                      }}
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

                {editingId === acc.id && (
                  <tr>
                    <td colSpan={6} style={{ padding: "12px" }}>
                      <div className="account-edit-box">
                        <div className="edit-row">
                          <label>Họ Tên</label>
                          <input
                            className="edit-input"
                            value={editValues.full_name || ""}
                            onChange={(e) =>
                              setEditValues((s) => ({
                                ...s,
                                full_name: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="edit-row">
                          <label>Email</label>
                          <input
                            className="edit-input"
                            value={editValues.email || ""}
                            onChange={(e) =>
                              setEditValues((s) => ({
                                ...s,
                                email: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="edit-row">
                          <label>Số ĐT</label>
                          <input
                            className="edit-input"
                            value={editValues.phone || ""}
                            onChange={(e) =>
                              setEditValues((s) => ({
                                ...s,
                                phone: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="edit-row">
                          <label>Vai trò</label>
                          <select
                            className="edit-input"
                            value={editValues.role || ""}
                            onChange={(e) =>
                              setEditValues((s) => ({
                                ...s,
                                role: e.target.value,
                              }))
                            }
                          >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </div>

                        <div className="edit-actions">
                          <button
                            className="edit-btn save"
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  `${API_URL}/api/accounts/${acc.id}`,
                                  {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(editValues),
                                  },
                                );
                                if (res.ok) {
                                  setAccounts((prev) =>
                                    prev.map((p) =>
                                      p.id === acc.id
                                        ? { ...p, ...editValues }
                                        : p,
                                    ),
                                  );
                                  setEditingId(null);
                                  setEditValues({});
                                } else {
                                  const err = await res.text();
                                  alert("Lỗi khi cập nhật: " + err);
                                }
                              } catch (e) {
                                console.error(e);
                                alert("Lỗi khi cập nhật, kiểm tra console");
                              }
                            }}
                          >
                            Lưu
                          </button>
                          <button
                            className="edit-btn cancel"
                            onClick={() => {
                              setEditingId(null);
                              setEditValues({});
                            }}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounts;
