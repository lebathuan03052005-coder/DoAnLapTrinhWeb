import React, { useState, useEffect } from "react";
import "./hotels.css";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // State quản lý bộ lọc nhanh đang được chọn
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  // Danh sách các bộ lọc nhanh
  const quickFilters = [
    "Tất cả",
    "Khách sạn",
    "Homestay",
    "Đà Lạt",
    "Vũng Tàu",
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/hotels");
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách sạn:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khách sạn này?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/hotels/${id}`, {
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

  // Logic lọc kết hợp cả "Ô tìm kiếm" VÀ "Bộ lọc nhanh"
  const filteredHotels = hotels.filter((hotel) => {
    // 1. Kiểm tra điều kiện nhập text
    const term = searchTerm.toLowerCase();
    const matchSearch =
      hotel.name.toLowerCase().includes(term) ||
      hotel.location.toLowerCase().includes(term);

    // 2. Kiểm tra điều kiện bấm nút lọc nhanh
    let matchQuickFilter = true;
    const nameLower = hotel.name.toLowerCase();
    const locLower = hotel.location.toLowerCase();

    if (activeFilter === "Khách sạn") {
      // Tìm chữ khách sạn hoặc hotel trong tên
      matchQuickFilter =
        nameLower.includes("khách sạn") || nameLower.includes("hotel");
    } else if (activeFilter === "Homestay") {
      matchQuickFilter = nameLower.includes("homestay");
    } else if (activeFilter === "Đà Lạt" || activeFilter === "Vũng Tàu") {
      matchQuickFilter = locLower.includes(activeFilter.toLowerCase());
    }

    // Kết hợp: Phải thỏa mãn cả 2 thì mới hiển thị
    return matchSearch && matchQuickFilter;
  });

  return (
    <div className="admin-hotels-container">
      <h3>Quản lý Khách sạn / Homestay</h3>

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
              <th>Giá/Đêm</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>{hotel.id}</td>
                  <td className="hotel-name">{hotel.name}</td>
                  <td>{hotel.location}</td>
                  <td>{hotel.price?.toLocaleString("vi-VN")} VND</td>
                  <td>
                    <button className="btn-edit">Sửa</button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(hotel.id)}
                    >
                      Xóa
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
    </div>
  );
};

export default Hotels;
