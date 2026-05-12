import React, { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import "./giao_dien.css";
import hotel1 from "../assets/hotel1.jpg";
import hotel1_2 from "../assets/hotel1_2.jpg";
import hotel1_3 from "../assets/hotel1_3.jpg"; 
import hotel1_4 from "../assets/hotel1_4.jpg";
import hotel1_5 from "../assets/hotel1_5.jpg";
import hotel1_6 from "../assets/hotel1_6.jpg";
import hotel1_7 from "../assets/hotel1_7.jpg";
import hotel1_8 from "../assets/hotel1_8.jpg";
import hotel1_9 from "../assets/hotel1_9.jpg";
import hotel1_10 from "../assets/hotel1_10.jpg";
import hotel2 from "../assets/hotel2.jpg";
import hotel2_1 from "../assets/hotel2_1.jpg";
import hotel2_2 from "../assets/hotel2_2.jpg";
import hotel2_3 from "../assets/hotel2_3.jpg";
import hotel2_4 from "../assets/hotel2_4.jpg";
import hotel2_5 from "../assets/hotel2_5.jpg";
import hotel2_6 from "../assets/hotel2_6.jpg";
import hotel2_7 from "../assets/hotel2_7.jpg";
import hotel2_8 from "../assets/hotel2_8.jpg";
import hotel2_9 from "../assets/hotel2_9.jpg";
import hotel2_10 from "../assets/hotel2_10.jpg";
import hotel3 from "../assets/hotel3.jpg";
import hotel3_1 from "../assets/hotel3_1.jpg";
import hotel3_2 from "../assets/hotel3_2.jpg";
import hotel3_3 from "../assets/hotel3_3.jpg";
import hotel3_4 from "../assets/hotel3_4.jpg";
import hotel3_5 from "../assets/hotel3_5.jpg";
import hotel3_6 from "../assets/hotel3_6.jpg";
import hotel3_7 from "../assets/hotel3_7.jpg";
import hotel3_8 from "../assets/hotel3_8.jpg";
import hotel3_9 from "../assets/hotel3_9.jpg";
import hotel3_10 from "../assets/hotel3_10.jpg";
import hotel4 from "../assets/hotel4.jpg";
import hotel4_1 from "../assets/hotel4_1.jpg";
import hotel4_2 from "../assets/hotel4_2.jpg";
import hotel4_3 from "../assets/hotel4_3.jpg";
import hotel4_4 from "../assets/hotel4_4.jpg";
import hotel4_5 from "../assets/hotel4_5.jpg";
import hotel4_6 from "../assets/hotel4_6.jpg";
import hotel4_7 from "../assets/hotel4_7.jpg";
import hotel4_8 from "../assets/hotel4_8.jpg";
import hotel4_9 from "../assets/hotel4_9.jpg";
import hotel4_10 from "../assets/hotel4_10.jpg";
import hotel5 from "../assets/hotel5.jpg";
import hotel5_1 from "../assets/hotel5_1.jpg";
import hotel5_2 from "../assets/hotel5_2.jpg";
import hotel5_3 from "../assets/hotel5_3.jpg";
import hotel5_4 from "../assets/hotel5_4.jpg";
import hotel5_5 from "../assets/hotel5_5.jpg";
import hotel5_6 from "../assets/hotel5_6.jpg";
import hotel5_7 from "../assets/hotel5_7.jpg";
import hotel5_8 from "../assets/hotel5_8.jpg";
import hotel5_9 from "../assets/hotel5_9.jpg";
import hotel5_10 from "../assets/hotel5_10.jpg";
import hotel6 from "../assets/hotel6.jpg";
import hotel6_1 from "../assets/hotel6_1.jpg";
import hotel6_2 from "../assets/hotel6_2.jpg";
import hotel6_3 from "../assets/hotel6_3.jpg";
import hotel6_4 from "../assets/hotel6_4.jpg";
import hotel6_5 from "../assets/hotel6_5.jpg";
import hotel6_6 from "../assets/hotel6_6.jpg";
import hotel6_7 from "../assets/hotel6_7.jpg";
import hotel6_8 from "../assets/hotel6_8.jpg";
import hotel6_9 from "../assets/hotel6_9.jpg";
import hotel6_10 from "../assets/hotel6_10.jpg";
import hotel7 from "../assets/hotel7.jpg";
import hotel7_1 from "../assets/hotel7_1.jpg";
import hotel7_2 from "../assets/hotel7_2.jpg";
import hotel7_3 from "../assets/hotel7_3.jpg";
import hotel7_4 from "../assets/hotel7_4.jpg";
import hotel7_5 from "../assets/hotel7_5.jpg";
import hotel7_6 from "../assets/hotel7_6.jpg";
import hotel7_7 from "../assets/hotel7_7.jpg";
import hotel7_8 from "../assets/hotel7_8.jpg";
import hotel7_9 from "../assets/hotel7_9.jpg";
import hotel7_10 from "../assets/hotel7_10.jpg";
import hotel8 from "../assets/hotel8.jpg";
import hotel8_1 from "../assets/hotel8_1.jpg";
import hotel8_2 from "../assets/hotel8_2.jpg";
import hotel8_3 from "../assets/hotel8_3.jpg";
import hotel8_4 from "../assets/hotel8_4.jpg";
import hotel8_5 from "../assets/hotel8_5.jpg";
import hotel8_6 from "../assets/hotel8_6.jpg";
import hotel8_7 from "../assets/hotel8_7.jpg";
import hotel8_8 from "../assets/hotel8_8.jpg";
import hotel8_9 from "../assets/hotel8_9.jpg";
import hotel8_10 from "../assets/hotel8_10.jpg";
import hotel9 from "../assets/hotel9.jpg";
import hotel9_1 from "../assets/hotel9_1.jpg";
import hotel9_2 from "../assets/hotel9_2.jpg";
import hotel9_3 from "../assets/hotel9_3.jpg";
import hotel9_4 from "../assets/hotel9_4.jpg";
import hotel9_5 from "../assets/hotel9_5.jpg";
import hotel9_6 from "../assets/hotel9_6.jpg";
import hotel9_7 from "../assets/hotel9_7.jpg";
import hotel9_8 from "../assets/hotel9_8.jpg";
import hotel9_9 from "../assets/hotel9_9.jpg";
import hotel9_10 from "../assets/hotel9_10.jpg";
import hotel10 from "../assets/hotel10.jpg";
import hotel10_1 from "../assets/hotel10_1.jpg";
import hotel10_2 from "../assets/hotel10_2.jpg";
import hotel10_3 from "../assets/hotel10_3.jpg";
import hotel10_4 from "../assets/hotel10_4.jpg";
import hotel10_5 from "../assets/hotel10_5.jpg";
import hotel10_6 from "../assets/hotel10_6.jpg";
import hotel10_7 from "../assets/hotel10_7.jpg";
import hotel10_8 from "../assets/hotel10_8.jpg";
import hotel10_9 from "../assets/hotel10_9.jpg";
import hotel10_10 from "../assets/hotel10_10.jpg";




const SearchResults = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAllPhuong, setShowAllPhuong] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const guestLabel = `${adults} người lớn${children > 0 ? `, ${children} trẻ em` : ''}`;
const locationState = useLocation();
const selectedLocation = locationState.state?.location || "Vũng Tàu";
const effectiveLocation = selectedLocation;
const checkIn = locationState.state?.checkInDate || "16/04/2026";
const checkOut = locationState.state?.checkOutDate || "17/04/2026";
const guestsFromHome = locationState.state?.guests || null;
console.log("📍 Địa điểm hiện tại:", effectiveLocation);
  const [hotelsData, setHotelsData] = useState([]);
  const danhSachPhuong = ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 7", "Phường 8", "Thắng Tam"];
  const phuongHienThi = showAllPhuong ? danhSachPhuong : danhSachPhuong.slice(0, 6);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  useEffect(() => {
  const fetchHotels = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/hotels", {
  cache: 'no-store'
});
const data = await res.json();

      setHotelsData(data);
    } catch (err) {
      console.error("Lỗi fetch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchHotels();
}, []);
const removeDiacritics = (str) =>
  (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const goToDetail = (hotel) => {
    // Ưu tiên dùng ảnh có sẵn trong data (chứa hotel1 của bạn). 
    // Nếu khách sạn nào chưa có subImages thì mới dùng 3 link ảnh dự phòng bên dưới.
    const hotelWithSubImages = {
      ...hotel,
      subImages: hotel.subImages || [
        "https://cdn.pixabay.com/photo/2014/07/21/19/20/lobby-398845_1280.jpg",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop"
      ]
    };
    navigate("/hotel-detail", { state: { hotel: hotelWithSubImages } });
    window.scrollTo(0, 0);
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
      style={{ position: 'relative', cursor: 'pointer' }}
      onClick={() => setShowGuestPicker(!showGuestPicker)}
    >
      <i className="fa-regular fa-user text-muted"></i>
      <input
        type="text"
        readOnly
        value={`${guestLabel}, ${rooms} phòng`}
        style={{ cursor: 'pointer', pointerEvents: 'none' }}
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
              <button onClick={() => setAdults(Math.max(1, adults - 1))}>−</button>
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
              <button onClick={() => setChildren(Math.max(0, children - 1))}>−</button>
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
              <button onClick={() => setRooms(Math.max(1, rooms - 1))}>−</button>
              <span>{rooms}</span>
              <button onClick={() => setRooms(rooms + 1)}>+</button>
            </div>
          </div>
          <button className="guest-apply-btn" onClick={() => setShowGuestPicker(false)}>
            Áp dụng
          </button>
        </div>
      )}
    </div>

    <button className="vnbk-btn-search">TÌM KIẾM</button>
  </div>
</div>

        <div className="vnbk-breadcrumbs">
          <a href="#">Trang chủ</a> » <a href="#">Khách sạn</a> » <span className="active">Khách sạn {effectiveLocation}</span>
        </div>

        <div className="vnbk-layout">
          {/* CỘT TRÁI: BỘ LỌC */}
          <aside className="vnbk-sidebar">

  {/* BỘ LỌC GIÁ — ĐẦU TIÊN */}
  <div className="vnbk-filter-box">
    <h4 className="filter-title">Khoảng giá</h4>
    <p className="price-range-value">
      0 đ — {maxPrice.toLocaleString("vi-VN")} đ
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
        <input type="checkbox" /> <span>{"⭐".repeat(star)}</span>
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
      <i className={`fa-solid ${item.icon}`} style={{ color: '#ef5b25', width: '16px' }}></i>
      <span>{item.label}</span>
    </label>
  ))}
</div>

</aside>
          {/* CỘT PHẢI: DANH SÁCH KHÁCH SẠN */}
          <main className="vnbk-results">
            <h2 className="result-title">
  Khách sạn {effectiveLocation}
</h2>

            {isLoading ? (
              <div className="vnbk-skeleton">
                 <div className="skeleton-item">Đang tìm kiếm những chỗ nghỉ tốt nhất...</div>
              </div>
            ) : (
              <div className="vnbk-real-hotel-list">
               {hotelsData

  .filter((hotel) => {
    const city = removeDiacritics(hotel.city);
    const name = removeDiacritics(hotel.name);
    const address = removeDiacritics(hotel.address);

    const location = removeDiacritics(effectiveLocation);
    const key = removeDiacritics(keyword);

    // FIX đúng ở đây
   console.log("city:", city, "| location:", location, "| match:", city.includes(location));
const matchLocation = location === "" || city.includes(location);
    const matchKeyword =
      key === "" ||
      name.includes(key) ||
      city.includes(key) ||
      address.includes(key);

    return matchLocation && matchKeyword;
  })
  .map((hotel) => (
                  <div 
                    className="vnbk-hotel-card" 
                    key={hotel.id}
                    style={{ cursor: 'pointer' }} 
                    onClick={() => goToDetail(hotel)}
                  >
                    <div className="vnbk-image-wrapper">
                     <img src={hotel.image} alt={hotel.name} className="hotel-img" />
                    </div>
                    
                    <div className="hotel-info">
                      <h3>{hotel.name} <span className="stars">{"⭐".repeat(hotel.stars)}</span></h3>
                      <p><i className="fa-solid fa-location-dot"></i> {hotel.address}</p>
                      <p className="rating-text">
                        <strong>{hotel.rating}</strong> Tuyệt vời ({hotel.reviews} đánh giá)
                      </p>
                      
                      <div className="vnbk-amenities-icons">
                      {(hotel.amenities || []).map((icon, index) => (
                          <span key={index}>
                            <i className={`fa-solid fa-${icon}`}></i> {
                              icon === 'wifi' ? 'Wifi' : 
                              icon === 'pool' ? 'Hồ bơi' : 
                              icon === 'snowflake' ? 'Máy lạnh' : 
                              icon === 'ban-smoking' ? 'Không hút thuốc' : 'Dịch vụ'
                            }
                          </span>
                        ))}
                        <span className="amenity-more">+ {Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                    </div>

                    <div className="hotel-price-box">
                   <p className="new-price">
  {hotel.price?.toLocaleString("vi-VN")} đ
</p>
                     <button 
  className="btn-book"
  onClick={(e) => {
    e.stopPropagation();
    goToDetail(hotel);
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
      </div>
   
  );
};

export default SearchResults;