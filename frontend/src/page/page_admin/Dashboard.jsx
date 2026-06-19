import React from "react";

const Dashboard = () => {
  return (
    <div>
      <h3 style={{ marginBottom: "20px", color: "#1f2937" }}>
        Tổng quan hệ thống
      </h3>
      <div className="dashboard-cards">
        <div className="card">
          <h4>TỔNG SỐ KHÁCH SẠN</h4>
          <h2 style={{ color: "#1890ff" }}>150</h2>
        </div>
        <div className="card">
          <h4>NGƯỜI DÙNG ĐĂNG KÝ</h4>
          <h2 style={{ color: "#10b981" }}>1,250</h2>
        </div>
        <div className="card">
          <h4>DOANH THU THÁNG NÀY (VND)</h4>
          <h2 style={{ color: "#f59e0b" }}>250,000,000</h2>
        </div>
        <div className="card">
          <h4>LƯỢT ĐẶT PHÒNG (BOOKINGS)</h4>
          <h2 style={{ color: "#8b5cf6" }}>320</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
