import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookings2.css";

const STATUS_LABEL = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy",
  PAID: "Đã thanh toán",
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "—";
  return Number(value).toLocaleString("vi-VN") + " đ";
};

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("vi-VN");
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusClass = (status) => {
  const s = (status || "").toUpperCase();
  if (s === "CONFIRMED" || s === "PAID") return "mb-pill mb-pill-confirmed";
  if (s === "CANCELLED") return "mb-pill mb-pill-cancelled";
  return "mb-pill mb-pill-pending";
};

const MyBookings2 = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl =
    import.meta.env.VITE_API_URL ||
    "https://doanlaptrinhweb-4n3f.onrender.com/api";

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isCustomerLoggedIn");
    const customerId = localStorage.getItem("customerId");
    const customerEmail = localStorage.getItem("customerEmail");

    if (!isLoggedIn || !customerId) {
      navigate("/dang-nhap-khach");
      return;
    }

    const fetchMyBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${baseUrl}/bookings/user/${customerId}${
          customerEmail ? `?email=${encodeURIComponent(customerEmail)}` : ""
        }`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok && data.success) {
          setBookings(data.bookings || []);
        } else {
          setError(data.message || "Không thể tải đơn đặt phòng của bạn.");
        }
      } catch (err) {
        console.error("Lỗi tải đơn đặt phòng:", err);
        setError("Lỗi kết nối tới hệ thống, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [baseUrl, navigate]);

  const customerName = localStorage.getItem("customerName");

  return (
    <div className="mb-page">
      <header className="mb-header">
        <span className="mb-eyebrow">Tài khoản của tôi</span>
        <h1>Đơn đặt phòng của {customerName || "bạn"}</h1>
        <p>Danh sách các đơn bạn đã đặt, kèm trạng thái xử lý mới nhất.</p>
      </header>

      {loading && <div className="mb-state">Đang tải đơn đặt phòng...</div>}

      {!loading && error && (
        <div className="mb-state mb-state-error">{error}</div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="mb-empty">
          <div className="mb-empty-icon">🗒️</div>
          <h3>Bạn chưa có đơn đặt phòng nào</h3>
          <p>Khi bạn đặt phòng, thông tin sẽ hiển thị ở đây.</p>
          <button className="mb-explore-btn" onClick={() => navigate("/")}>
            Tìm khách sạn ngay
          </button>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mb-list">
          {bookings.map((b) => (
            <div
              key={b.id}
              className={`mb-card status-edge-${(b.status || "pending").toLowerCase()}`}
            >
              <div className="mb-card-head">
                {b.hotel_image && (
                  <img
                    src={b.hotel_image}
                    alt={b.hotel_name}
                    className="mb-hotel-img"
                  />
                )}
                <div className="mb-card-head-text">
                  <div className="mb-hotel-name">{b.hotel_name || "—"}</div>
                  <div className="mb-hotel-address">{b.hotel_address}</div>
                </div>
                <span className={statusClass(b.status)}>
                  {STATUS_LABEL[(b.status || "").toUpperCase()] ||
                    b.status ||
                    "Chờ xác nhận"}
                </span>
              </div>

              <div className="mb-card-body">
                <div className="mb-info-row">
                  <span className="mb-info-label">Mã đơn</span>
                  <span className="mb-info-value">#{b.id}</span>
                </div>
                <div className="mb-info-row">
                  <span className="mb-info-label">Loại phòng</span>
                  <span className="mb-info-value">
                    {b.room_type_name || "—"}
                  </span>
                </div>
                <div className="mb-info-row">
                  <span className="mb-info-label">Nhận / Trả phòng</span>
                  <span className="mb-info-value">
                    {formatDate(b.check_in_date)} →{" "}
                    {formatDate(b.check_out_date)}
                  </span>
                </div>
                <div className="mb-info-row">
                  <span className="mb-info-label">Người liên hệ</span>
                  <span className="mb-info-value">
                    {b.guest_name} · {b.guest_phone}
                  </span>
                </div>
                <div className="mb-info-row mb-total-row">
                  <span className="mb-info-label">Tổng tiền</span>
                  <span className="mb-total-value">
                    {formatCurrency(b.total_amount)}
                  </span>
                </div>
              </div>

              <div className="mb-card-footer">
                Đặt lúc {formatDateTime(b.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings2;
