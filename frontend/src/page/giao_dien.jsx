import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./giao_dien.css";
import { removeDiacritics } from "./utils";
import { locationGuides } from "./locationGuides";
import "./locationGuides.css";
import formatCurrency from "../utils/formatCurrency";
// Trả về URL công khai cho ảnh đã được chuyển vào `public/assets/anhHotel`
import { getImageUrl } from "../utils/getImageUrl"; // sửa path import cho đúng vị trí file thật
const SearchResults = () => {
  const navigate = useNavigate();
  const locationState = useLocation();

  const selectedLocation = locationState.state?.location || "";
  const effectiveLocation = selectedLocation;
  const guideKey = Object.keys(locationGuides).find(
    (key) => removeDiacritics(key) === removeDiacritics(effectiveLocation),
  );
  const currentGuide = guideKey ? locationGuides[guideKey] : null;
  const guestsFromHome = locationState.state?.guests;

  const [isLoading, setIsLoading] = useState(true);
  const [showAllPhuong, setShowAllPhuong] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [keyword, setKeyword] = useState(locationState.state?.keyword || "");
  const checkIn = locationState.state?.checkInDate || "";
  const checkOut = locationState.state?.checkOutDate || "";
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [selectedStars, setSelectedStars] = useState([]);
  const [hotelsData, setHotelsData] = useState([]);

  // Lấy số người lớn từ guests truyền qua
  const [adults, setAdults] = useState(() => {
    if (guestsFromHome) {
      const match = guestsFromHome.match(/(\d+) người lớn/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  });

  // Lấy số trẻ em từ guests truyền qua
  const [children, setChildren] = useState(() => {
    if (guestsFromHome) {
      const match = guestsFromHome.match(/(\d+) trẻ em/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  });

  // Lấy số phòng từ guests truyền qua
  const [rooms, setRooms] = useState(() => {
    if (guestsFromHome) {
      const match = guestsFromHome.match(/(\d+) phòng/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  });

  const guestLabel = `${adults} người lớn${children > 0 ? `, ${children} trẻ em` : ""}`;

  const toggleStar = (star) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star],
    );
  };
  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true); // Bắt đầu trạng thái loading
      try {
        // Dùng biến môi trường (URL trên Render hoặc mặc định là localhost)
        const baseUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        const res = await fetch(`${baseUrl}/api/hotels`, {
          cache: "no-store",
        });

        // Kiểm tra nếu phản hồi không thành công (ví dụ: 404, 500)
        if (!res.ok) throw new Error("Lỗi khi tải danh sách khách sạn");

        const data = await res.json();
        setHotelsData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi fetch:", err);
        setHotelsData([]); // Reset dữ liệu khi có lỗi
      } finally {
        setIsLoading(false); // Kết thúc loading dù thành công hay thất bại
      }
    };

    fetchHotels();
  }, []);
  const goToDetail = (hotel) => {
    console.log("🏨 Hotel data:", hotel);
    navigate("/hotel-detail", {
      state: {
        hotel: hotel,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests: `${guestLabel}, ${rooms} phòng`,
      },
    });
  };
  return (
    <div className="vnbk-page-container">
      {/* 1. THANH TÌM KIẾM */}
      <div className="vnbk-search-bar-wrapper">
        <div className="vnbk-search-bar">
          {/* Ô địa điểm */}
          <div className="vnbk-input-group">
            <i className="fa-solid fa-location-dot text-muted"></i>
            <input
              type="text"
              placeholder="Địa điểm hoặc tên Khách sạn"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* Ô ngày check-in */}
          <div className="vnbk-input-group">
            <i className="fa-regular fa-calendar text-muted"></i>
            <input type="text" value={checkIn} readOnly />
          </div>

          {/* Ô ngày check-out */}
          <div className="vnbk-input-group">
            <i className="fa-regular fa-calendar text-muted"></i>
            <input type="text" value={checkOut} readOnly />
          </div>

          {/* Ô chọn khách */}
          <div
            className="vnbk-input-group"
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => setShowGuestPicker(!showGuestPicker)}
          >
            <i className="fa-regular fa-user text-muted"></i>
            <input
              type="text"
              readOnly
              value={`${guestLabel}, ${rooms} phòng`}
              style={{ cursor: "pointer", pointerEvents: "none" }}
            />
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

          <button
            className="vnbk-btn-search"
            onClick={() =>
              navigate("/search", {
                state: {
                  location: effectiveLocation, // ← giữ nguyên location hiện tại
                  checkInDate: checkIn,
                  checkOutDate: checkOut,
                  keyword: keyword, // ← truyền keyword riêng để filter theo tên
                },
              })
            }
          >
            TÌM KIẾM
          </button>
        </div>
      </div>

      <div className="vnbk-breadcrumbs">
        <a href="#">Trang chủ</a> » <a href="#">Khách sạn</a> »{" "}
        <span className="active">Khách sạn {effectiveLocation}</span>
      </div>

      <div className="vnbk-layout">
        {/* CỘT TRÁI: BỘ LỌC */}
        <aside className="vnbk-sidebar">
          {/* BỘ LỌC GIÁ — ĐẦU TIÊN */}
          <div className="vnbk-filter-box">
            <h4 className="filter-title">Khoảng giá</h4>
            <p className="price-range-value">
              0 đ — {formatCurrency(maxPrice)} đ
            </p>
            <input
              type="range"
              min="0"
              max="5000000"
              step="100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <div className="price-range-labels">
              <span>0 đ</span>
              <span>5.000.000 đ</span>
            </div>
          </div>

          {/* HẠNG SAO */}
          <div className="vnbk-filter-box">
            <h4 className="filter-title">Hạng sao</h4>
            {[5, 4, 3, 2, 1].map((star) => (
              <label className="vnbk-checkbox-item" key={star}>
                <input
                  type="checkbox"
                  checked={selectedStars.includes(star)}
                  onChange={() => toggleStar(star)}
                />{" "}
                <span>{"⭐".repeat(star)}</span>
              </label>
            ))}
          </div>

          {/* KHU VỰC */}
          {/* TIỆN ÍCH */}
          <div className="vnbk-filter-box">
            <h4 className="filter-title">Tiện ích</h4>
            {[
              { icon: "fa-wifi", label: "Wifi miễn phí" },
              { icon: "fa-swimming-pool", label: "Hồ bơi" },
              { icon: "fa-snowflake", label: "Máy lạnh" },
              { icon: "fa-ban-smoking", label: "Không hút thuốc" },
              { icon: "fa-dumbbell", label: "Phòng gym" },
              { icon: "fa-spa", label: "Spa" },
              { icon: "fa-parking", label: "Bãi đỗ xe" },
              { icon: "fa-utensils", label: "Nhà hàng" },
            ].map((item) => (
              <label className="vnbk-checkbox-item" key={item.label}>
                <input type="checkbox" />
                <i
                  className={`fa-solid ${item.icon}`}
                  style={{ color: "#ef5b25", width: "16px" }}
                ></i>
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </aside>
        {/* CỘT PHẢI: DANH SÁCH KHÁCH SẠN */}
        <main className="vnbk-results">
          <h2 className="result-title">Khách sạn {effectiveLocation}</h2>

          {isLoading ? (
            <div className="vnbk-skeleton">
              <div className="skeleton-item">
                Đang tìm kiếm những chỗ nghỉ tốt nhất...
              </div>
            </div>
          ) : (
            <div className="vnbk-real-hotel-list">
              {hotelsData

                .filter((hotel) => {
                  const city = removeDiacritics(hotel.city)
                    .toLowerCase()
                    .trim();
                  const name = removeDiacritics(hotel.name)
                    .toLowerCase()
                    .trim();
                  const address = removeDiacritics(hotel.address)
                    .toLowerCase()
                    .trim();
                  const location = removeDiacritics(effectiveLocation)
                    .toLowerCase()
                    .trim();
                  const key = removeDiacritics(keyword).toLowerCase().trim();

                  const matchLocation =
                    key !== "" || location === "" || city.includes(location);
                  const matchKeyword =
                    key === "" ||
                    name.includes(key) ||
                    city.includes(key) ||
                    address.includes(key);
                  const matchPrice = hotel.price <= maxPrice;
                  const matchStars =
                    selectedStars.length === 0 ||
                    selectedStars.includes(hotel.stars);
                  return (
                    matchLocation && matchKeyword && matchPrice && matchStars
                  );
                })
                .map((hotel) => (
                  <div
                    className="vnbk-hotel-card"
                    key={hotel.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => goToDetail(hotel)}
                  >
                    <div className="vnbk-image-wrapper">
                      <img
                        src={getImageUrl(hotel.image)}
                        alt={hotel.name}
                        className="hotel-img"
                      />
                    </div>

                    <div className="hotel-info">
                      <h3>
                        {hotel.name}{" "}
                        <span className="stars">
                          {"⭐".repeat(hotel.stars)}
                        </span>
                      </h3>
                      <p>
                        <i className="fa-solid fa-location-dot"></i>{" "}
                        {hotel.address}
                      </p>
                      <p className="rating-text">
                        <strong>{hotel.rating}</strong> Tuyệt vời (
                        {hotel.reviews} đánh giá)
                      </p>

                      <div className="vnbk-amenities-icons">
                        {(hotel.amenities || []).map((icon, index) => (
                          <span key={index}>
                            <i className={`fa-solid fa-${icon}`}></i>{" "}
                            {icon === "wifi"
                              ? "Wifi"
                              : icon === "pool"
                                ? "Hồ bơi"
                                : icon === "snowflake"
                                  ? "Máy lạnh"
                                  : icon === "ban-smoking"
                                    ? "Không hút thuốc"
                                    : "Dịch vụ"}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="hotel-price-box">
                      <p className="new-price">
                        {formatCurrency(hotel.price)} đ
                      </p>
                      <button
                        className="btn-book"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToDetail(hotel); // ← không phải navigate trực tiếp
                        }}
                      >
                        Chọn phòng
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </main>
      </div>

      {currentGuide && (
        <div className="location-guide-section">
          <h3>{effectiveLocation} - Hướng dẫn chi tiết</h3>

          {/* Khu vực nên ở */}
          {currentGuide.bestAreas && (
            <div className="guide-subsection">
              <h4>Nên ở khu vực nào?</h4>
              <p>{currentGuide.bestAreas}</p>
            </div>
          )}

          {currentGuide.topHotels && (
            <div className="guide-subsection">
              <h4>Top khách sạn nổi bật</h4>
              {currentGuide.topHotels.map((item, i) => (
                <div key={i} className="guide-hotel-block">
                  <h3 className="guide-hotel-title">{item.name}</h3>

                  <ul className="guide-hotel-info-list">
                    <li>Hạng sao: {item.stars}</li>
                    <li>Địa chỉ: {item.address}</li>
                    <li>Giá từ: {item.priceFrom}</li>
                  </ul>

                  <p className="guide-hotel-paragraph">
                    <strong>{item.categoryLabel}</strong> đầu tiên mà Vietnam
                    Booking muốn giới thiệu đến bạn chính là{" "}
                    <strong className="guide-hotel-name-inline">
                      {item.brandName}
                    </strong>
                    . {item.desc}
                  </p>

                  {item.image && (
                    <figure className="guide-hotel-figure">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="guide-hotel-img"
                      />
                    </figure>
                  )}

                  {item.imageCaption && (
                    <p className="guide-hotel-caption">{item.imageCaption}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Thời điểm lý tưởng */}
          {currentGuide.bestTime && (
            <div className="guide-subsection">
              <h4>Thời điểm lý tưởng</h4>
              <p>{currentGuide.bestTime}</p>
            </div>
          )}

          {/* Phần giới thiệu */}
          <div className="guide-intro">
            <h4>Về {effectiveLocation}</h4>
            <p>{currentGuide.intro}</p>
          </div>

          {/* Điểm tham quan */}
          <div className="guide-subsection">
            <h4>Điểm tham quan nổi tiếng</h4>
            {currentGuide.attractions?.map((item, i) => (
              <div key={i} className="guide-item">
                <strong>{item.name}</strong>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Ẩm thực */}
          <div className="guide-subsection">
            <h4>Ẩm thực địa phương</h4>
            {currentGuide.foods?.map((item, i) => (
              <div key={i} className="guide-food-block">
                <h5 className="guide-food-title">{item.name}</h5>
                <ul className="guide-hotel-info-list">
                  <li>Địa chỉ: {item.address}</li>
                  <li>Giờ mở cửa: {item.hours}</li>
                  <li>Giá: {item.price}</li>
                </ul>
                <p className="guide-hotel-paragraph">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Mẹo du lịch */}
          <div className="guide-subsection">
            <h4>Mẹo đặt phòng & du lịch</h4>
            <ul>
              {currentGuide.tips?.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Loại hình lưu trú */}
          {currentGuide.accommodationTypes && (
            <div className="guide-subsection">
              <h4>Loại hình lưu trú</h4>
              <p>{currentGuide.accommodationTypes}</p>
            </div>
          )}

          {/* Cách di chuyển */}
          {currentGuide.transport && (
            <div className="guide-subsection">
              <h4>Cách di chuyển</h4>
              <p>{currentGuide.transport}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
