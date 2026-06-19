import React, { useState, useEffect } from "react";
import "./hotels.css";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showRoom, setShowRoom] = useState(false);
  // State quản lý bộ lọc nhanh đang được chọn
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  // Danh sách các bộ lọc nhanh
  const quickFilters = ["Tất cả", "Khách sạn", "Đà Lạt", "Vũng Tàu"];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/hotels`);
      if (response.ok) {
        const data = await response.json();
        // dữ liệu lấy về được lưu trong biến hotels
        setHotels(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách sạn:", error);
    }
  };
  const [message, setMessage] = useState("");

  const duLieuPhong = async (hotelId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/hotels/${hotelId}/rooms`,
      );
      const result = await response.json();

      if (result.success) {
        setRooms(result.data);
        setMessage(result.message || ""); // Lưu thông báo nếu có
        setShowRoom(true);
      }
    } catch (error) {
      alert("Lỗi kết nối");
    }
  };
  const formatCurrency = (amount) => {
    if (!amount) return "0 đ"; // Xử lý nếu giá trị bị null hoặc undefined
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khách sạn này?")) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/hotels/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        fetchHotels();
      }
    } catch (error) {
      alert("Lỗi khi kết nối để xóa");
    }
  };

  const handleAccess = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn duyệt khách sạn này?")) return;
    try {
      const response = await fetch(
        `${API_URL}/api/admin/hotels/${id}/approved`,
        { method: "PUT" },
      );
      const data = await response.json();
      if (data.success) {
        fetchHotels();
      } else {
        alert("Lỗi khi cập nhật trạng thái truy cập");
      }
    } catch (error) {
      alert("Lỗi khi kết nối để cập nhật trạng thái truy cập");
    }
  };
  const handleBanned = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn cấm khách sạn này?")) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/hotels/${id}/banned`, {
        method: "PUT",
      });
      const data = await response.json();
      if (data.success) {
        fetchHotels();
      } else {
        alert("Lỗi khi cập nhật trạng thái truy cập");
      }
    } catch (error) {
      alert("Lỗi khi kết nối để cập nhật trạng thái truy cập");
    }
  };
  // Logic lọc kết hợp cả "Ô tìm kiếm" VÀ "Bộ lọc nhanh"
  const filteredHotels = hotels.filter((hotel) => {
    // 1. Kiểm tra điều kiện nhập text
    const term = searchTerm.toLowerCase();
    const matchSearch =
      hotel.name.toLowerCase().includes(term) ||
      hotel.city.toLowerCase().includes(term);

    // 2. Kiểm tra điều kiện bấm nút lọc nhanh
    let matchQuickFilter = true;
    const nameLower = hotel.name.toLowerCase();
    const locLower = hotel.city.toLowerCase();

    if (activeFilter === "Khách sạn") {
      // Tìm chữ khách sạn hoặc hotel trong tên
      matchQuickFilter =
        nameLower.includes("khách sạn") || nameLower.includes("hotel");
    } else if (activeFilter === "Đà Lạt" || activeFilter === "Vũng Tàu") {
      matchQuickFilter = locLower.includes(activeFilter.toLowerCase());
    }

    // Kết hợp: Phải thỏa mãn cả 2 thì mới hiển thị
    return matchSearch && matchQuickFilter;
  });

  return (
    <div className="admin-hotels-container">
      <h3>Quản lý Khách sạn </h3>
      {/* Khu vực Tìm kiếm & Bộ lọc */}
      <div className="admin-hotels-filter-section">
        {/* Hàng 1: Ô nhập tìm kiếm */}
        <div className="search-row">
          <span className="search-label">Tìm kiếm:</span>
          <input
            type="text"
            className="search-input"
            placeholder="Nhập tên khách sạn hoặc vị trí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn-clear-search"
              onClick={() => setSearchTerm("")}
            >
              Xóa text
            </button>
          )}
        </div>

        {/* Hàng 2: Các nút bấm bộ lọc nhanh */}
        <div className="quick-filters-row">
          <span className="filter-label">Lọc nhanh:</span>
          <div className="filter-tags">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                className={`btn-quick-filter ${activeFilter === filter ? "active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Bảng danh sách */}
      <div className="table-responsive">
        <table className="admin-hotels-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Khách Sạn</th>
              <th>Vị trí</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>{hotel.id}</td>
                  <td className="hotel-name">{hotel.name}</td>
                  <td>{hotel.city}</td>
                  <td>{hotel.status}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleAccess(hotel.id)}
                    >
                      Duyệt
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(hotel.id)}
                    >
                      Xóa
                    </button>
                    <button
                      className="btn-banned"
                      onClick={() => handleBanned(hotel.id)}
                    >
                      Cấm
                    </button>
                    <button
                      className="btn-details"
                      onClick={() => setSelectedHotel(hotel)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  Không tìm thấy dữ liệu nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedHotel && (
        <div className="modal-backdrop" onClick={() => setSelectedHotel(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Chi tiết khách sạn</h2>

            <div className="modal-body">
              <p>
                <strong>ID:</strong> <span>{selectedHotel.id}</span>
              </p>
              <p>
                <strong>Tên:</strong> <span>{selectedHotel.name}</span>
              </p>
              <p>
                <strong>Thành phố:</strong> <span>{selectedHotel.city}</span>
              </p>

              <p>
                <strong>Trạng thái:</strong>
                <span className={`status-badge ${selectedHotel.status}`}>
                  {selectedHotel.status}
                </span>
              </p>

              <p>
                <strong>Mô tả:</strong> <span>{selectedHotel.description}</span>
              </p>
              <p>
                <strong>Địa chỉ:</strong> <span>{selectedHotel.address}</span>
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedHotel(null)}
              >
                Đóng
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  duLieuPhong(selectedHotel.id);
                }}
              >
                Xem danh sách phòng
              </button>
            </div>
          </div>
        </div>
      )}
      {showRoom && (
        <div className="modal-backdrop" onClick={() => setShowRoom(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Danh sách phòng</h2>

            {rooms.length > 0 && (
              <p style={{ color: "#555", fontWeight: "bold" }}>
                Tổng số phòng: {rooms.length}
              </p>
            )}

            {rooms.length === 0 ? (
              <p className="empty-message">{message}</p>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="room-card">
                  <span className="room-name">{room.name}</span>
                  <span className="room-price">
                    {formatCurrency(room.base_price)}
                  </span>
                </div>
              ))
            )}

            <button className="btn-close" onClick={() => setShowRoom(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotels;
