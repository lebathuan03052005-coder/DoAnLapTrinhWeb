import React, { useState, useEffect } from "react";
import "./HotelManagement.css";

const API = "https://doanlaptrinhweb-4n3f.onrender.com";
const STAR_MAP = { 1: "★", 2: "★★", 3: "★★★", 4: "★★★★", 5: "★★★★★" };
const statusLabel = (s) => ({ approved: "Đã duyệt", pending: "Chờ duyệt", banned: "Bị cấm" }[s] || s);
const statusClass = (s) => ({ approved: "badge--approved", pending: "badge--pending", banned: "badge--banned" }[s] || "");

const EMPTY_FORM = { name: "", city: "", address: "", description: "", stars: 3, price: "", status: "pending" };

export default function HotelManagement() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  // Modal state
  const [modal, setModal] = useState(null); // null | "add" | "edit"
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => { fetchHotels(); }, []);

  const fetchHotels = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/api/admin/hotels`);
      const data = await res.json();
      setHotels(Array.isArray(data) ? data : []);
    } catch { setError("Không thể tải danh sách khách sạn."); }
    finally { setLoading(false); }
  };

  const showToast = (type, text) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 3000);
  };

  const openDetail = async (hotel) => {
    setSelectedHotel(hotel); setRooms([]); setRoomsLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/hotels/${hotel.id}/rooms`);
      const data = await res.json();
      setRooms(data.data || []);
    } catch { setRooms([]); }
    finally { setRoomsLoading(false); }
  };

  const openAdd = () => {
    setForm(EMPTY_FORM); setFormError(""); setModal("add");
  };

  const openEdit = (hotel, e) => {
    e?.stopPropagation();
    setForm({
      id: hotel.id,
      name: hotel.name || "",
      city: hotel.city || "",
      address: hotel.address || "",
      description: hotel.description || "",
      stars: hotel.stars || 3,
      price: hotel.price || "",
      status: hotel.status || "pending",
    });
    setFormError(""); setModal("edit");
  };

  const closeModal = () => { setModal(null); setFormError(""); };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.city.trim() || !form.address.trim()) {
      setFormError("Vui lòng điền đầy đủ tên, thành phố và địa chỉ!"); return;
    }
    setFormLoading(true); setFormError("");
    try {
      const isEdit = modal === "edit";
      const url = isEdit ? `${API}/api/admin/hotels/${form.id}` : `${API}/api/admin/hotels`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", isEdit ? "Cập nhật khách sạn thành công!" : "Thêm khách sạn thành công!");
        closeModal();
        fetchHotels();
        if (isEdit && selectedHotel?.id === form.id) {
          setSelectedHotel((prev) => ({ ...prev, ...form }));
        }
      } else {
        setFormError(data.message || "Thao tác thất bại!");
      }
    } catch { setFormError("Lỗi kết nối server!"); }
    finally { setFormLoading(false); }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${API}/api/admin/hotels/${id}/${action}`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message);
        fetchHotels();
        if (selectedHotel?.id === id)
          setSelectedHotel((prev) => ({ ...prev, status: action }));
      }
    } catch { showToast("error", "Thao tác thất bại!"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá khách sạn này?")) return;
    try {
      const res = await fetch(`${API}/api/admin/hotels/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Xoá khách sạn thành công!");
        fetchHotels();
        if (selectedHotel?.id === id) setSelectedHotel(null);
      }
    } catch { showToast("error", "Xoá thất bại!"); }
  };

  const cities = ["Tất cả", ...new Set(hotels.map((h) => h.city).filter(Boolean))];
  const statuses = ["Tất cả", "approved", "pending", "banned"];
  const filtered = hotels.filter((h) => {
    const q = search.toLowerCase();
    return (
      (h.name?.toLowerCase().includes(q) || h.address?.toLowerCase().includes(q)) &&
      (cityFilter === "Tất cả" || h.city === cityFilter) &&
      (statusFilter === "Tất cả" || h.status === statusFilter)
    );
  });
  const stats = {
    total: hotels.length,
    approved: hotels.filter((h) => h.status === "approved").length,
    pending: hotels.filter((h) => h.status === "pending").length,
    banned: hotels.filter((h) => h.status === "banned").length,
  };

  return (
    <div className="hm-root">
      {/* Toast */}
      {actionMsg && <div className={`hm-toast hm-toast--${actionMsg.type}`}>{actionMsg.text}</div>}

      {/* Modal Thêm / Sửa */}
      {modal && (
        <div className="hm-overlay" onClick={closeModal}>
          <div className="hm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hm-modal-header">
              <h2>{modal === "add" ? "➕ Thêm khách sạn mới" : "✏️ Sửa thông tin khách sạn"}</h2>
              <button className="hm-close" onClick={closeModal}>✕</button>
            </div>
            <div className="hm-modal-body">
              <div className="hm-form-grid">
                <div className="hm-field hm-field--full">
                  <label>Tên khách sạn *</label>
                  <input name="name" value={form.name} onChange={handleFormChange} placeholder="VD: Pullman Vũng Tàu" />
                </div>
                <div className="hm-field">
                  <label>Thành phố *</label>
                  <input name="city" value={form.city} onChange={handleFormChange} placeholder="VD: Vũng Tàu" />
                </div>
                <div className="hm-field">
                  <label>Hạng sao</label>
                  <select name="stars" value={form.stars} onChange={handleFormChange}>
                    {[1,2,3,4,5].map((s) => <option key={s} value={s}>{STAR_MAP[s]} ({s} sao)</option>)}
                  </select>
                </div>
                <div className="hm-field hm-field--full">
                  <label>Địa chỉ *</label>
                  <input name="address" value={form.address} onChange={handleFormChange} placeholder="VD: 33 Thùy Vân, Phường 8..." />
                </div>
                <div className="hm-field">
                  <label>Giá/đêm (₫)</label>
                  <input name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="VD: 1500000" />
                </div>
                <div className="hm-field">
                  <label>Trạng thái</label>
                  <select name="status" value={form.status} onChange={handleFormChange}>
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="banned">Bị cấm</option>
                  </select>
                </div>
                <div className="hm-field hm-field--full">
                  <label>Mô tả</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} placeholder="Mô tả ngắn về khách sạn..." />
                </div>
              </div>
              {formError && <div className="hm-form-error">{formError}</div>}
            </div>
            <div className="hm-modal-footer">
              <button className="hm-btn hm-btn--refresh" onClick={closeModal}>Huỷ</button>
              <button className="hm-btn hm-btn--approve" onClick={handleSubmit} disabled={formLoading}>
                {formLoading ? "Đang lưu..." : modal === "add" ? "➕ Thêm mới" : "💾 Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="hm-header">
        <div>
          <h1 className="hm-title">Quản lý Khách sạn</h1>
          <p className="hm-subtitle">Duyệt, cấm và theo dõi toàn bộ hệ thống khách sạn</p>
        </div>
        <div className="hm-header-actions">
          <button className="hm-btn hm-btn--refresh" onClick={fetchHotels}>↻ Làm mới</button>
          <button className="hm-btn hm-btn--add" onClick={openAdd}>➕ Thêm khách sạn</button>
        </div>
      </div>

      {/* Stats */}
      <div className="hm-stats">
        <div className="hm-stat-card"><span className="hm-stat-num">{stats.total}</span><span className="hm-stat-label">Tổng số</span></div>
        <div className="hm-stat-card hm-stat-card--approved"><span className="hm-stat-num">{stats.approved}</span><span className="hm-stat-label">Đã duyệt</span></div>
        <div className="hm-stat-card hm-stat-card--pending"><span className="hm-stat-num">{stats.pending}</span><span className="hm-stat-label">Chờ duyệt</span></div>
        <div className="hm-stat-card hm-stat-card--banned"><span className="hm-stat-num">{stats.banned}</span><span className="hm-stat-label">Bị cấm</span></div>
      </div>

      {/* Filters */}
      <div className="hm-filters">
        <input className="hm-search" placeholder="🔍  Tìm kiếm tên, địa chỉ..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="hm-select" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="hm-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statuses.map((s) => <option key={s} value={s}>{s === "Tất cả" ? "Tất cả trạng thái" : statusLabel(s)}</option>)}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="hm-loading"><div className="hm-spinner" /><p>Đang tải dữ liệu...</p></div>
      ) : error ? (
        <div className="hm-error"><p>{error}</p><button className="hm-btn hm-btn--refresh" onClick={fetchHotels}>Thử lại</button></div>
      ) : (
        <div className="hm-layout">
          <div className={`hm-table-wrap ${selectedHotel ? "hm-table-wrap--narrow" : ""}`}>
            <table className="hm-table">
              <thead>
                <tr>
                  <th>Khách sạn</th>
                  <th>Thành phố</th>
                  <th>Sao</th>
                  <th>Giá/đêm</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="hm-empty">Không tìm thấy khách sạn nào</td></tr>
                ) : filtered.map((hotel) => (
                  <tr key={hotel.id} className={`hm-row ${selectedHotel?.id === hotel.id ? "hm-row--active" : ""}`} onClick={() => openDetail(hotel)}>
                    <td>
                      <div className="hm-hotel-name">{hotel.name}</div>
                      <div className="hm-hotel-addr">{hotel.address}</div>
                    </td>
                    <td><span className="hm-city">{hotel.city}</span></td>
                    <td><span className="hm-stars">{STAR_MAP[hotel.stars] || "—"}</span></td>
                    <td><span className="hm-price">{hotel.price ? Number(hotel.price).toLocaleString("vi-VN") + "₫" : "—"}</span></td>
                    <td><span className={`hm-badge ${statusClass(hotel.status)}`}>{statusLabel(hotel.status)}</span></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="hm-actions">
                        <button className="hm-btn hm-btn--edit" onClick={(e) => openEdit(hotel, e)}>✏️</button>
                        {hotel.status !== "approved" && <button className="hm-btn hm-btn--approve" onClick={() => handleAction(hotel.id, "approved")}>Duyệt</button>}
                        {hotel.status !== "banned" && <button className="hm-btn hm-btn--ban" onClick={() => handleAction(hotel.id, "banned")}>Cấm</button>}
                        <button className="hm-btn hm-btn--delete" onClick={() => handleDelete(hotel.id)}>Xoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="hm-count">{filtered.length} / {hotels.length} khách sạn</div>
          </div>

          {/* Detail Panel */}
          {selectedHotel && (
            <div className="hm-detail">
              <div className="hm-detail-header">
                <h2 className="hm-detail-title">{selectedHotel.name}</h2>
                <button className="hm-close" onClick={() => setSelectedHotel(null)}>✕</button>
              </div>
              <div className="hm-detail-body">
                <div className="hm-detail-row"><span className="hm-detail-label">Thành phố</span><span>{selectedHotel.city}</span></div>
                <div className="hm-detail-row"><span className="hm-detail-label">Địa chỉ</span><span>{selectedHotel.address}</span></div>
                <div className="hm-detail-row"><span className="hm-detail-label">Hạng sao</span><span className="hm-stars">{STAR_MAP[selectedHotel.stars] || "—"}</span></div>
                <div className="hm-detail-row"><span className="hm-detail-label">Đánh giá</span><span>⭐ {selectedHotel.rating}/10</span></div>
                <div className="hm-detail-row"><span className="hm-detail-label">Giá từ</span><span className="hm-price">{selectedHotel.price ? Number(selectedHotel.price).toLocaleString("vi-VN") + "₫/đêm" : "—"}</span></div>
                <div className="hm-detail-row"><span className="hm-detail-label">Trạng thái</span><span className={`hm-badge ${statusClass(selectedHotel.status)}`}>{statusLabel(selectedHotel.status)}</span></div>
                {selectedHotel.description && (
                  <div className="hm-detail-desc"><span className="hm-detail-label">Mô tả</span><p>{selectedHotel.description}</p></div>
                )}
                <div className="hm-detail-actions">
                  <button className="hm-btn hm-btn--edit" onClick={(e) => openEdit(selectedHotel, e)}>✏️ Sửa thông tin</button>
                  {selectedHotel.status !== "approved" && <button className="hm-btn hm-btn--approve" onClick={() => handleAction(selectedHotel.id, "approved")}>✓ Duyệt</button>}
                  {selectedHotel.status !== "banned" && <button className="hm-btn hm-btn--ban" onClick={() => handleAction(selectedHotel.id, "banned")}>⊘ Cấm</button>}
                  <button className="hm-btn hm-btn--delete" onClick={() => handleDelete(selectedHotel.id)}>🗑 Xoá</button>
                </div>
                <div className="hm-rooms">
                  <h3 className="hm-rooms-title">Loại phòng</h3>
                  {roomsLoading ? (
                    <div className="hm-rooms-loading"><div className="hm-spinner hm-spinner--sm" /> Đang tải...</div>
                  ) : rooms.length === 0 ? (
                    <p className="hm-rooms-empty">Chưa có loại phòng nào.</p>
                  ) : (
                    <div className="hm-room-list">
                      {rooms.map((r) => (
                        <div key={r.id} className="hm-room-card">
                          <div className="hm-room-name">{r.name}</div>
                          <div className="hm-room-meta">
                            <span>👥 {r.capacity} khách</span>
                            <span>🛏 {r.bed_type || "—"}</span>
                            <span>🪟 {r.view_type || "—"}</span>
                          </div>
                          <div className="hm-room-price">{r.base_price ? Number(r.base_price).toLocaleString("vi-VN") + "₫/đêm" : "—"}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
