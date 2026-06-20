import { useNavigate } from "react-router-dom";
import "./trang_chu.css";
import React, { useState, useEffect } from "react";
import formatCurrency from "../utils/formatCurrency";

const HomePage = () => {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Hàm chuyển đổi đường dẫn ảnh sang URL tĩnh của Backend
  const getImageUrl = (filePath) => {
    if (!filePath) return "https://via.placeholder.com/400x250?text=No+Image";
    if (filePath.startsWith("http")) return filePath;
    // Đồng bộ cách lấy ảnh giống bên trang chi tiết từ STATIC_BASE
    const staticBase = API_BASE.replace(/\/api\/?$/, "");
    const pathPart = filePath.startsWith("/") ? filePath : `/${filePath}`;
    return `${staticBase}${pathPart}`;
  };

  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [hotelsData, setHotelsData] = useState([]); // Chứa dữ liệu lấy từ API

  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [adults, setAdults] = useState(1); // Mặc định nên là 1 người lớn
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1); // Mặc định nên là 1 phòng
  const [activeLocation, setActiveLocation] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const locations = ["Vũng Tàu", "Đà Lạt"];

  // Gọi API lấy toàn bộ danh sách khách sạn khi vào trang chủ
  useEffect(() => {
    const fetchAllHotels = async () => {
      try {
        const res = await fetch(`${API_BASE}/hotels`); // Điều chỉnh endpoint tùy backend của bạn
        if (res.ok) {
          const data = await res.json();
          setHotelsData(data);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách khách sạn:", err);
      }
    };
    fetchAllHotels();
  }, [API_BASE]);

  const featuredHotels = [
    ...hotelsData
      .filter((h) => h.city === "Vũng Tàu" && h.stars === 5)
      .slice(0, 2),
    ...hotelsData
      .filter((h) => h.city === "Đà Lạt" && h.stars === 5)
      .slice(0, 2),
  ];

  const handleSearch = () => {
    const location = destination.trim() || activeLocation;
    const keyword = destination.trim();
    navigate("/search", {
      state: {
        location,
        checkInDate,
        checkOutDate,
        keyword,
        adults,
        children,
        rooms,
      },
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi Sáng";
    if (hour < 18) return "Chào buổi Chiều";
    return "Chào buổi Tối!";
  };

  return (
    <div className="homepage-wrapper">
      <div className="agoda-hero">
        <h1
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "800",
            color: "#050101",
            textShadow: "2px 2px 6px rgba(0,0,0,0.25)",
            marginBottom: "30px",
            letterSpacing: "1px",
            lineHeight: "1.4",
          }}
        >
          RONG CHƠI BỐN PHƯƠNG, GIÁ VẪN "YÊU THƯƠNG"
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <p
            style={{
              maxWidth: "900px",
              textAlign: "center",
              fontSize: "1.15rem",
              fontWeight: "600",
              color: "#222",
              lineHeight: "1.8",
              textShadow: "1px 1px 4px rgba(0,0,0,0.15)",
              marginBottom: "30px",
              padding: "0 20px",
            }}
          >
            HÂN HẠNH ĐƯỢC PHỤC VỤ QUÝ KHÁCH, CHÚC QUÝ KHÁCH CÓ MỘT KỲ NGHỈ THẬT
            THÚ VỊ VÀ NHIỀU NIỀM VUI
          </p>
        </div>

        <div className="search-bar-horizontal">
          <div className="search-field" style={{ position: "relative" }}>
            <i className="fa-solid fa-location-dot search-field-icon"></i>
            <div className="search-field-content">
              <span className="search-field-label">Địa điểm</span>
              <input
                type="text"
                value={destination}
                onFocus={() => setShowLocationDropdown(true)}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Tìm kiếm điểm đến"
                className="search-field-input"
              />
              {showLocationDropdown && (
                <div className="location-dropdown">
                  {locations.map((location) => (
                    <div
                      key={location}
                      className="location-item"
                      onClick={() => {
                        setDestination(location);
                        setActiveLocation(location);
                        setShowLocationDropdown(false);
                      }}
                    >
                      <i className="fa-solid fa-location-dot"></i>
                      <span>{location}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="search-divider" />

          <div className="search-field">
            <i className="fa-regular fa-calendar search-field-icon"></i>
            <div className="search-field-content">
              <span className="search-field-label">Nhận phòng</span>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="search-field-input"
              />
            </div>
          </div>

          <div className="search-divider" />

          <div className="search-field">
            <i className="fa-regular fa-calendar search-field-icon"></i>
            <div className="search-field-content">
              <span className="search-field-label">Trả phòng</span>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="search-field-input"
              />
            </div>
          </div>

          <div className="search-divider" />

          <div
            className="search-field"
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => setShowGuestPicker(!showGuestPicker)}
          >
            <i className="fa-solid fa-user-group search-field-icon"></i>
            <div className="search-field-content">
              <span className="search-field-label">Khách</span>
              <span className="search-field-value">
                {adults > 0
                  ? `${adults} người lớn${children > 0 ? `, ${children} trẻ em` : ""}, ${rooms} phòng`
                  : "Thêm khách"}
              </span>
            </div>
            {showGuestPicker && (
              <div
                className="guest-dropdown-panel"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="counter-row">
                  <div>
                    <b>Người lớn</b>
                    <p>Từ 18 tuổi trở lên</p>
                  </div>
                  <div>
                    <button onClick={() => setAdults(Math.max(1, adults - 1))}>
                      −
                    </button>
                    <span>{adults}</span>
                    <button onClick={() => setAdults(adults + 1)}>+</button>
                  </div>
                </div>
                <div className="counter-row">
                  <div>
                    <b>Trẻ em</b>
                    <p>Từ 0 – 17 tuổi</p>
                  </div>
                  <div>
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                    >
                      −
                    </button>
                    <span>{children}</span>
                    <button onClick={() => setChildren(children + 1)}>+</button>
                  </div>
                </div>
                <div className="counter-row">
                  <div>
                    <b>Phòng</b>
                    <p>Số lượng phòng</p>
                  </div>
                  <div>
                    <button onClick={() => setRooms(Math.max(1, rooms - 1))}>
                      −
                    </button>
                    <span>{rooms}</span>
                    <button onClick={() => setRooms(rooms + 1)}>+</button>
                  </div>
                </div>
                <button
                  className="guest-apply-btn"
                  onClick={() => setShowGuestPicker(false)}
                >
                  Áp dụng
                </button>
              </div>
            )}
          </div>

          <button className="search-btn-circle" onClick={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      <div className="recommendation-section">
        <div className="rec-header">
          <h2 className="featured-title">Địa điểm nổi bật</h2>
          <div className="see-more" onClick={() => navigate("/search")}>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>

        <div className="property-grid">
          {featuredHotels.map((item) => (
            <div
              className="property-card"
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/hotel-detail", {
                  state: {
                    hotel: item,
                    checkInDate,
                    checkOutDate,
                    guests: `${adults} người lớn, ${rooms} phòng`,
                  },
                });
              }}
            >
              <div className="card-image-wrapper">
                <img src={getImageUrl(item.image)} alt={item.name} />
                <span className="city-badge">
                  <i className="fa-solid fa-location-dot"></i> {item.city}
                </span>
                <span className="rating-badge">{item.rating}</span>
              </div>
              <div className="card-info">
                <h3 className="property-title">{item.name}</h3>
                <div className="property-meta">
                  <span className="stars">
                    {[...Array(item.stars)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </span>
                  <span className="location-link">
                    <i className="fa-solid fa-location-dot"></i> {item.address}
                  </span>
                </div>
                <div className="price-section">
                  <p className="price-note">Giá mỗi đêm chưa gồm thuế và phí</p>
                  <p className="price">{formatCurrency(item.price)} đ</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="promo-section">
        <h2 className="promo-title">Khách Sạn Khuyến Mãi</h2>
        <p className="promo-subtitle">
          Chính sách ưu đãi tại Vietnam Booking lên đến 60% tiền phòng
        </p>
        <div className="promo-grid">
          {hotelsData
            .filter((h) => h.discount)
            .slice(0, 3)
            .map((h) => (
              <div
                className="promo-card"
                key={h.id}
                onClick={() => {
                  navigate("/hotel-detail", {
                    state: {
                      hotel: h,
                      checkInDate,
                      checkOutDate,
                      guests: `${adults} người lớn, ${rooms} phòng`,
                    },
                  });
                }}
              >
                <div className="promo-badge">Tiết kiệm -{h.discount}%</div>
                <div className="promo-img-wrapper">
                  <img src={getImageUrl(h.image)} alt={h.name} />
                </div>
                <div className="promo-info">
                  <h3>{h.name}</h3>
                  <div className="promo-stars">
                    <span>🏨</span> {"⭐".repeat(h.stars)}
                  </div>
                  <p className="promo-address">{h.address}</p>
                  <div className="promo-price-row">
                    <span className="promo-new-price">
                      {formatCurrency(h.price)} VND
                    </span>
                    <span className="promo-old-price">
                      {formatCurrency(
                        Math.round(h.price / (1 - h.discount / 100)),
                      )}{" "}
                      VND
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
