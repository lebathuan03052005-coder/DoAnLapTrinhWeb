import React, { useEffect, useState } from "react";
import "./BookingsList.css";

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

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const baseUrl =
    import.meta.env.VITE_API_URL ||
    "https://doanlaptrinhweb-4n3f.onrender.com/api";

  // Thay thế hàm fetchBookings cũ bằng hàm này:
  const fetchBookings = async () => {
    const userId = localStorage.getItem("customerId"); // Lấy ID đã lưu khi đăng nhập

    if (!userId) {
      setError("Bạn cần đăng nhập để xem đơn hàng.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Gọi route mới lọc theo userId
      const res = await fetch(`${baseUrl}/api/my-bookings?userId=${userId}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setBookings(data.bookings || []);
      } else {
        setError(data.message || "Không thể tải danh sách đặt phòng.");
      }
    } catch (err) {
      setError("Lỗi kết nối tới hệ thống.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === "ALL" || (b.status || "").toUpperCase() === statusFilter;
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      b.guest_name?.toLowerCase().includes(term) ||
      b.guest_phone?.toLowerCase().includes(term) ||
      b.guest_email?.toLowerCase().includes(term) ||
      b.hotel_name?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const statusClass = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "CONFIRMED" || s === "PAID")
      return "status-pill status-confirmed";
    if (s === "CANCELLED") return "status-pill status-cancelled";
    return "status-pill status-pending";
  };

  return (
    <div className="bk-page">
      <header className="bk-header">
        <div className="bk-header-text">
          <span className="bk-eyebrow">Quản lý phòng đã đặt</span>
          <h1>Đơn đặt phòng</h1>
          <p>Toàn bộ thông tin đặt bàn của bạn.</p>
        </div>
        <div className="bk-count-card">
          <span className="bk-count-number">{bookings.length}</span>
          <span className="bk-count-label">tổng đơn</span>
        </div>
      </header>

      <div className="bk-toolbar">
        <input
          type="text"
          className="bk-search"
          placeholder="Tìm theo tên, SĐT, email hoặc khách sạn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="bk-filters">
          {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((s) => (
            <button
              key={s}
              className={`bk-filter-btn ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "ALL" ? "Tất cả" : STATUS_LABEL[s] || s}
            </button>
          ))}
        </div>
        <button className="bk-refresh-btn" onClick={fetchBookings}>
          ⟳ Làm mới
        </button>
      </div>

      {loading && <div className="bk-state">Đang tải dữ liệu...</div>}

      {!loading && error && (
        <div className="bk-state bk-state-error">
          {error}
          <button className="bk-retry-btn" onClick={fetchBookings}>
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bk-state">
          Chưa có đơn đặt phòng nào khớp với tìm kiếm hiện tại.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="bk-table-wrapper">
            <table className="bk-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Khách sạn</th>
                  <th>Loại phòng</th>
                  <th>Nhận / Trả phòng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr
                    key={b.id}
                    className={`bk-row status-edge-${(b.status || "pending").toLowerCase()}`}
                  >
                    <td className="bk-id">#{b.id}</td>
                    <td>
                      <div className="bk-guest-name">{b.guest_name || "—"}</div>
                      <div className="bk-guest-sub">{b.guest_phone}</div>
                      <div className="bk-guest-sub">{b.guest_email}</div>
                    </td>
                    <td>
                      <div className="bk-hotel-name">{b.hotel_name || "—"}</div>
                      <div className="bk-guest-sub">{b.hotel_address}</div>
                    </td>
                    <td>{b.room_type_name || "—"}</td>
                    <td>
                      <div>{formatDate(b.check_in_date)}</div>
                      <div className="bk-guest-sub">
                        → {formatDate(b.check_out_date)}
                      </div>
                    </td>
                    <td className="bk-amount">
                      {formatCurrency(b.total_amount)}
                    </td>
                    <td>
                      <span className={statusClass(b.status)}>
                        {STATUS_LABEL[(b.status || "").toUpperCase()] ||
                          b.status ||
                          "Chờ xác nhận"}
                      </span>
                    </td>
                    <td className="bk-date">{formatDateTime(b.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="bk-cards">
            {filtered.map((b) => (
              <div
                key={b.id}
                className={`bk-card status-edge-${(b.status || "pending").toLowerCase()}`}
              >
                <div className="bk-card-top">
                  <span className="bk-id">#{b.id}</span>
                  <span className={statusClass(b.status)}>
                    {STATUS_LABEL[(b.status || "").toUpperCase()] ||
                      b.status ||
                      "Chờ xác nhận"}
                  </span>
                </div>
                <div className="bk-guest-name">{b.guest_name || "—"}</div>
                <div className="bk-guest-sub">
                  {b.guest_phone} · {b.guest_email}
                </div>
                <div className="bk-card-row">
                  <span>Khách sạn</span>
                  <span>{b.hotel_name || "—"}</span>
                </div>
                <div className="bk-card-row">
                  <span>Loại phòng</span>
                  <span>{b.room_type_name || "—"}</span>
                </div>
                <div className="bk-card-row">
                  <span>Nhận / Trả phòng</span>
                  <span>
                    {formatDate(b.check_in_date)} →{" "}
                    {formatDate(b.check_out_date)}
                  </span>
                </div>
                <div className="bk-card-row bk-card-total">
                  <span>Tổng tiền</span>
                  <span>{formatCurrency(b.total_amount)}</span>
                </div>
                <div className="bk-card-date">
                  {formatDateTime(b.created_at)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsList;
