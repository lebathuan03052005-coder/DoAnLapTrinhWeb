import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./trang_chu.css";

const HomePage = () => {
  const navigate = useNavigate();
  
  // State của phần tìm kiếm
  const [activeTab, setActiveTab] = useState("khach-san");
  const [activeSubTab, setActiveSubTab] = useState("qua-dem");
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("2026-04-22");
  const [checkOutDate, setCheckOutDate] = useState("2026-04-25");

  // State của phần danh sách chỗ nghỉ
  const [activeLocation, setActiveLocation] = useState("Vũng Tàu");
  const [focusedBox, setFocusedBox] = useState(null);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const handleSearch = () => {
    const location = destination.trim() || activeLocation;
    navigate("/search", { state: { location, checkInDate, checkOutDate } });
  };

  // Dữ liệu mẫu cho Tabs địa điểm
  const locations = ["Vũng Tàu", "Hồ Chí Minh", "Đà Lạt", "Đà Nẵng", "Hà Nội"];

  // Dữ liệu mẫu cho danh sách căn hộ
  const propertyData = [
    {
      id: 1,
      name: "The Song Vũng Tàu Xinh (The Song Vung Tau Xinh)",
      rating: "9.1",
      stars: 5,
      location: "Thắng Tam, Vũng Tàu",
      price: "VND 372.251",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/629964325.jpg?k=c66a031f078c19853f411f3b00ac709800a86d7fc5e93cb9bebb28a3524aebcb&o"},
{
      id: 2,
      name: "Căn hộ The Sóng - Mai Villa Vũng Tàu (The Song Apartment - Mai Villa)",
      rating: "8.8",
      stars: 4,
      location: "Thắng Tam, Vũng Tàu",
      price: "VND 325.456",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/701046047.jpg?k=111b6fe20d775698bcf2515f271f7147c7c7dd45d08de81585b17a033085dcfe&o="
    },
    {
      id: 3,
      name: "Căn hộ The Song Vũng Tàu - Villa gần Biển - Minh Anh Villa",
      rating: "8.6",
      stars: 5,
      location: "Thắng Tam, Vũng Tàu",
      price: "VND 473.332",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      name: "Căn hộ The Song Vũng Tàu - Căn hộ Biển_Paris Homestay",
      rating: "8.5",
      stars: 5,
      location: "Thắng Tam, Vũng Tàu",
      price: "VND 301.190",
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="homepage-wrapper">
      {/* ========================================== */}
      {/* PHẦN 1: HERO SECTION & TÌM KIẾM              */}
      {/* ========================================== */}
      <div className="agoda-hero">
        <h1 className="hero-headline">RONG CHƠI BỐN PHƯƠNG, GIÁ VẪN "YÊU THƯƠNG"</h1>
        
        <div className="search-container-v2">
          {/* Tabs dịch vụ */}
          <div className="main-tabs-v2">
            <div className={`tab-v2 ${activeTab === 'khach-san' ? 'active' : ''}`} onClick={() => setActiveTab('khach-san')}>
              <i className="fa-solid fa-bed"></i> <span>Khách sạn</span>
            </div>
            
            <div className={`tab-v2 ${activeTab === 'nha-can-ho' ? 'active' : ''}`} onClick={() => setActiveTab('nha-can-ho')}>
              <i className="fa-solid fa-house"></i> <span>Homestay</span>
            </div>
           
            <div className={`tab-v2 ${activeTab === 'hoat-dong' ? 'active' : ''}`} onClick={() => setActiveTab('hoat-dong')}>
              <i className="fa-solid fa-ticket"></i> <span>Hoạt động</span>
            </div>
          </div>

          <div className="sub-tabs">
            <button className={`sub-tab-btn ${activeSubTab === 'qua-dem' ? 'active' : ''}`} onClick={() => setActiveSubTab('qua-dem')}>
              Chỗ Ở Qua Đêm
            </button>
            <button className={`sub-tab-btn ${activeSubTab === 'trong-ngay' ? 'active' : ''}`} onClick={() => setActiveSubTab('trong-ngay')}>
              Chỗ Ở Trong Ngày
            </button>
          </div>

          {/* Form tìm kiếm */}
          <div className="search-form-v2">
            
            {/* 1. Ô nhập điểm đến */}
            <div 
              className={`input-box full-width ${focusedBox === 'destination' ? 'active-focus' : ''}`}
              onClick={() => setFocusedBox('destination')}
            >
              <i className="fa-solid fa-magnifying-glass icon"></i>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Nhập địa điểm du lịch hoặc tên khách sạn"
              />
            </div>

            <div className="input-row">
              {/* 2. Ô Ngày Check-in */}
              <div 
                className={`input-box half-width ${focusedBox === 'checkin' ? 'active-focus' : ''}`}
                onClick={() => setFocusedBox('checkin')}
              >
                <i className="fa-regular fa-calendar icon"></i>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', padding: '8px 0' }}
                />
              </div>

              
              <div 
                className={`input-box half-width ${focusedBox === 'checkout' ? 'active-focus' : ''}`}
                onClick={() => setFocusedBox('checkout')}
              >
                <i className="fa-regular fa-calendar icon"></i>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', padding: '8px 0' }}
                />
              </div>
            </div>

           
           <div 
  className={`input-box full-width has-dropdown ${focusedBox === 'guests' ? 'active-focus' : ''}`}
  onClick={() => {
    setFocusedBox('guests');
    setShowGuestPicker(!showGuestPicker);
  }}
  style={{ position: 'relative' }}
>
  <div className="box-left">
    <i className="fa-solid fa-user-group icon"></i>
    <div className="input-text">
      <span className="main-text">
        {adults} người lớn{children > 0 ? `, ${children} trẻ em` : ''}
      </span>
      <span className="sub-text">{rooms} phòng</span>
    </div>
  </div>
  <i className="fa-solid fa-chevron-down icon-arrow"></i>

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

          </div>

          <button className="search-submit-btn" onClick={handleSearch}>TÌM</button>
        </div>
      </div>

      {/* ========================================== */}
      {/* PHẦN 2: DANH SÁCH CHỖ NGHỈ NỔI BẬT         */}
      {/* ========================================== */}
      <div className="recommendation-section">
        {/* Header Tabs */}
        <div className="rec-header">
          <div className="location-tabs">
            {locations.map((loc, index) => (
              <div 
                key={index}
                className={`loc-tab ${activeLocation === loc ? 'active' : ''}`}
                onClick={() => setActiveLocation(loc)}
              >
                {loc}
              </div>
            ))}
          </div>
          <div className="see-more" onClick={() => navigate("/search", { state: { location: activeLocation } })}>
            Xem thêm các chỗ nghỉ ({activeLocation}) <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>

        {/* Lưới danh sách chỗ nghỉ */}
        <div className="property-grid">
          {propertyData.map((item) => (
            <div className="property-card" key={item.id}>
             
              <div className="card-image-wrapper">
                <img src={item.image} alt={item.name} />
                <span className="rating-badge">{item.rating}</span>
              </div>
              
              {/* Thông tin chi tiết */}
              <div className="card-info">
                <h3 className="property-title">{item.name}</h3>
                
                <div className="property-meta">
                  <span className="stars">
                    {/* In ra số sao tương ứng */}
                    {[...Array(item.stars)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </span>
                  <span className="location-link">
                    <i className="fa-solid fa-location-dot"></i> {item.location}
                  </span>
                </div>

                <div className="price-section">
                  <p className="price-note">Giá mỗi đêm chưa gồm thuế và phí</p>
                  <p className="price">{item.price}</p>
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