import React, { useState, useEffect } from "react";
import "./BookingManagement.css";

const API = "https://doanlaptrinhweb-4n3f.onrender.com";

const statusLabel = (s) =>
  ({
    PENDING: "Chờ duyệt",
    pending: "Chờ duyệt",
    CONFIRMED: "Đã duyệt",
    confirmed: "Đã duyệt",
    CANCELLED: "Đã từ chối",
    cancelled: "Đã từ chối",
  })[s] || s;

const statusClass = (s) =>
  ({
    PENDING: "badge--pending",
    pending: "badge--pending",
    CONFIRMED: "badge--approved",
    confirmed: "badge--approved",
    CANCELLED: "badge--banned",
    cancelled: "badge--banned",
  })[s] || "";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [actingId, setActingId] = useState(null); // id booking đang xử lý (disable nút trong lúc chờ)

  const userId = localStorage.getItem("customerId");
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  // Chỉ admin hoặc đúng partner_id (chủ khách sạn) của booking đó mới được duyệt/từ chối.
  // Đây chỉ là ẩn nút cho gọn UI — quyền thật vẫn được server kiểm tra lại ở route PUT /api/bookings/:id/status
  const canManage = (booking) =>
    isAdmin ||
    (userId &&
      booking.partner_id != null &&
      String(booking.partner_id) === String(userId));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/bookings`);
      const data = await res.json();
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch {
      setError("Không thể tải danh sách đặt phòng.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, text) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 3000);
  };

  // Cập nhật trạng thái booking (duyệt / từ chối)
  // Server sẽ tự kiểm tra: chỉ chủ khách sạn (hotels.partner_id) hoặc admin mới được duyệt
  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (!userId) {
      showToast("error", "Bạn cần đăng nhập để thực hiện thao tác này!");
      return;
    }
    setActingId(bookingId);
    try {
      const res = await fetch(`${API}/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, userId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          "success",
          newStatus === "CONFIRMED"
            ? "Đã duyệt đặt phòng thành công!"
            : "Đã từ chối đặt phòng!",
        );
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: newStatus } : b,
          ),
        );
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        showToast("error", data.message || "Thao tác thất bại!");
      }
    } catch {
      showToast("error", "Lỗi kết nối server!");
    } finally {
      setActingId(null);
    }
  };

  const statuses = ["Tất cả", "PENDING", "CONFIRMED", "CANCELLED"];

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      b.guest_name?.toLowerCase().includes(q) ||
      b.guest_phone?.includes(q) ||
      b.guest_email?.toLowerCase().includes(q) ||
      b.hotel_name?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "Tất cả" ||
      b.status?.toUpperCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status?.toUpperCase() === "PENDING")
      .length,
    confirmed: bookings.filter((b) => b.status?.toUpperCase() === "CONFIRMED")
      .length,
    cancelled: bookings.filter((b) => b.status?.toUpperCase() === "CANCELLED")
      .length,
  };

  const formatMoney = (n) =>
    n ? Number(n).toLocaleString("vi-VN") + "₫" : "—";

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "—");

  return (
    <div className="bm-root">
      {/* Toast */}
      {actionMsg && (
        <div className={`bm-toast bm-toast--${actionMsg.type}`}>
          {actionMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="bm-header">
        <div>
          <h1 className="bm-title">Quản lý Đặt phòng</h1>
          <p className="bm-subtitle">
            Duyệt hoặc từ chối các yêu cầu đặt phòng
          </p>
        </div>
        <div className="bm-header-actions">
          <button className="bm-btn bm-btn--refresh" onClick={fetchBookings}>
            ↻ Làm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bm-stats">
        <div className="bm-stat-card">
          <span className="bm-stat-num">{stats.total}</span>
          <span className="bm-stat-label">Tổng số</span>
        </div>
        <div className="bm-stat-card bm-stat-card--pending">
          <span className="bm-stat-num">{stats.pending}</span>
          <span className="bm-stat-label">Chờ duyệt</span>
        </div>
        <div className="bm-stat-card bm-stat-card--approved">
          <span className="bm-stat-num">{stats.confirmed}</span>
          <span className="bm-stat-label">Đã duyệt</span>
        </div>
        <div className="bm-stat-card bm-stat-card--banned">
          <span className="bm-stat-num">{stats.cancelled}</span>
          <span className="bm-stat-label">Đã từ chối</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bm-filters">
        <input
          className="bm-search"
          placeholder="🔍  Tìm theo tên, SĐT, email, khách sạn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bm-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "Tất cả" ? "Tất cả trạng thái" : statusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bm-loading">
          <div className="bm-spinner" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="bm-error">
          <p>{error}</p>
          <button className="bm-btn bm-btn--refresh" onClick={fetchBookings}>
            Thử lại
          </button>
        </div>
      ) : (
        <div className="bm-layout">
          <div
            className={`bm-table-wrap ${selectedBooking ? "bm-table-wrap--narrow" : ""}`}
          >
            <table className="bm-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Khách sạn</th>
                  <th>Số tiền</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="bm-empty">
                      Không tìm thấy đơn đặt phòng nào
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => {
                    const isPending = b.status?.toUpperCase() === "PENDING";
                    const isActing = actingId === b.id;
                    const showActions = isPending && canManage(b);
                    return (
                      <tr
                        key={b.id}
                        className={`bm-row ${selectedBooking?.id === b.id ? "bm-row--active" : ""}`}
                        onClick={() => setSelectedBooking(b)}
                      >
                        <td>
                          <div className="bm-guest-name">{b.guest_name}</div>
                          <div className="bm-guest-sub">{b.guest_phone}</div>
                        </td>
                        <td>
                          <span className="bm-hotel">
                            {b.hotel_name || "—"}
                          </span>
                        </td>
                        <td>
                          <span className="bm-price">
                            {formatMoney(b.total_amount)}
                          </span>
                        </td>
                        <td>{formatDate(b.created_at)}</td>
                        <td>
                          <span className={`bm-badge ${statusClass(b.status)}`}>
                            {statusLabel(b.status)}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="bm-actions">
                            {showActions ? (
                              <>
                                <button
                                  className="bm-btn bm-btn--approve"
                                  disabled={isActing}
                                  onClick={() =>
                                    handleUpdateStatus(b.id, "CONFIRMED")
                                  }
                                >
                                  {isActing ? "..." : "✓ Duyệt"}
                                </button>
                                <button
                                  className="bm-btn bm-btn--reject"
                                  disabled={isActing}
                                  onClick={() =>
                                    handleUpdateStatus(b.id, "CANCELLED")
                                  }
                                >
                                  {isActing ? "..." : "✕ Từ chối"}
                                </button>
                              </>
                            ) : (
                              <span className="bm-no-action">
                                {isPending ? "Chờ chủ KS duyệt" : "—"}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="bm-count">
              {filtered.length} / {bookings.length} đơn đặt phòng
            </div>
          </div>

          {/* Detail Panel */}
          {selectedBooking && (
            <div className="bm-detail">
              <div className="bm-detail-header">
                <h2 className="bm-detail-title">
                  Đơn #{selectedBooking.id}
                </h2>
                <button
                  className="bm-close"
                  onClick={() => setSelectedBooking(null)}
                >
                  ✕
                </button>
              </div>
              <div className="bm-detail-body">
                <div className="bm-detail-row">
                  <span className="bm-detail-label">Khách hàng</span>
                  <span>{selectedBooking.guest_name}</span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">Số điện thoại</span>
                  <span>{selectedBooking.guest_phone}</span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">Email</span>
                  <span>{selectedBooking.guest_email || "—"}</span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">Khách sạn</span>
                  <span>{selectedBooking.hotel_name || "—"}</span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">Loại phòng</span>
                  <span>{selectedBooking.room_type_name || "—"}</span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">Nhận phòng</span>
                  <span>{formatDate(selectedBooking.check_in_date)}</span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">Trả phòng</span>
                  <span>{formatDate(selectedBooking.check_out_date)}</span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">Tổng tiền</span>
                  <span className="bm-price">
                    {formatMoney(selectedBooking.total_amount)}
                  </span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">Trạng thái</span>
                  <span
                    className={`bm-badge ${statusClass(selectedBooking.status)}`}
                  >
                    {statusLabel(selectedBooking.status)}
                  </span>
                </div>

                {selectedBooking.status?.toUpperCase() === "PENDING" &&
                  canManage(selectedBooking) && (
                  <div className="bm-detail-actions">
                    <button
                      className="bm-btn bm-btn--approve"
                      disabled={actingId === selectedBooking.id}
                      onClick={() =>
                        handleUpdateStatus(selectedBooking.id, "CONFIRMED")
                      }
                    >
                      ✓ Duyệt đặt phòng
                    </button>
                    <button
                      className="bm-btn bm-btn--reject"
                      disabled={actingId === selectedBooking.id}
                      onClick={() =>
                        handleUpdateStatus(selectedBooking.id, "CANCELLED")
                      }
                    >
                      ✕ Từ chối
                    </button>
                  </div>
                )}
                {selectedBooking.status?.toUpperCase() === "PENDING" &&
                  !canManage(selectedBooking) && (
                  <p className="bm-no-action" style={{ marginTop: 10 }}>
                    Chỉ chủ khách sạn (hoặc admin) mới có thể duyệt đơn này.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
