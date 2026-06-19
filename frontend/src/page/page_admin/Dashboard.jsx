import React, { useState, useEffect } from "react";
import "./dashboard.css";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [stats, setStats] = useState({ pending: 0, approved: 0, banned: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/hotels`);
      const data = await response.json();

      const hotels = Array.isArray(data) ? data : [];

      setStats({
        pending: hotels.filter((h) => h.status === "pending").length,
        approved: hotels.filter((h) => h.status === "approved").length,
        banned: hotels.filter((h) => h.status === "banned").length,
      });
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Tổng quan hệ thống</h1>

      {loading ? (
        <div className="loading-spinner">Đang tải dữ liệu...</div>
      ) : (
        <div className="stats-grid">
          <StatCard
            title="Cần phê duyệt"
            value={stats.pending}
            type="pending"
          />
          <StatCard
            title="Đang hoạt động"
            value={stats.approved}
            type="approved"
          />
          <StatCard title="Đã bị cấm" value={stats.banned} type="banned" />
        </div>
      )}
    </div>
  );
};

// Component con để code gọn hơn
const StatCard = ({ title, value, type }) => (
  <div className={`stat-card ${type}`}>
    <h3 className="stat-title">{title}</h3>
    <p className="stat-number">{value}</p>
  </div>
);

export default Dashboard;
