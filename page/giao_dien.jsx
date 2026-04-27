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
  const [isLoading, setIsLoading] = useState(true);
  const [showAllPhuong, setShowAllPhuong] = useState(false);
const locationState = useLocation();
const selectedLocation = locationState.state?.location || "Vũng Tàu";
  // 1. DỮ LIỆU DANH SÁCH KHÁCH SẠN (Thay vì viết tay từng block, ta dùng mảng)
  const hotelsData = [
    {
      id: 1,
      name: "Khách sạn Imperial Vũng Tàu",
      location: "Vũng Tàu", 
      stars: 5,
      address: "159 Thùy Vân, Thắng Tam, Vũng Tàu",
      oldPrice: "3.500.000 đ",
      newPrice: "2.150.000 đ",
      rating: 9.5,
      reviews: 1200,
      mainImage: hotel1,
      subImages: [
        hotel1_2, 
        hotel1_3,
        hotel1_4,
        hotel1_5,
        hotel1_6,
        hotel1_7,
        hotel1_8,
        hotel1_9,
        hotel1_10
      ]
      ,
      amenities: ["wifi", "pool", "concierge"]
    },
    {
      id: 2,
      name: "Căn hộ The Sóng Vũng Tàu",
      location: "Vũng Tàu", 
      stars: 4,
      address: "28 Thi Sách, Thắng Tam, Vũng Tàu",
      oldPrice: "1.800.000 đ",
      newPrice: "1.100.000 đ",
      rating: 8.8,
      reviews: 850,
      mainImage: hotel2,
      subImages: [
        hotel2_1,
        hotel2_2,
        hotel2_3,
        hotel2_4,
        hotel2_5,
        hotel2_6,
        hotel2_7,
        hotel2_8,
        hotel2_9,
        hotel2_10
      ],
      amenities: ["wifi", "snowflake", "pool"]
    },
    {
      id: 3,
      name: "Dhawa Hồ Tràm",
      location: "Vũng Tàu", 
      stars: 5,
      address: "Đường Ven Biển, Phước Thuận, Xuyên Mộc",
      oldPrice: "3.200.000 đ",
      newPrice: "2.000.000 đ",
      rating: 9.2,
      reviews: 540,
      mainImage: hotel4,
      subImages: [
        hotel4_1,
        hotel4_2,
        hotel4_3,
        hotel4_4,
        hotel4_5,
        hotel4_6,
        hotel4_7,
        hotel4_8,
        hotel4_9,
        hotel4_10
        
        
      ],
      amenities: ["wifi", "ban-smoking", "bell-concierge"]
    },
    {
      id: 4,
      name: "Khách sạn Ibis Styles Vũng Tàu",
      location: "Vũng Tàu",
      stars: 4,
      address: "117 Thùy Vân, Thắng Tam, Vũng Tàu",
      oldPrice: "1.900.000 đ",
      newPrice: "1.400.000 đ",
      rating: 8.9,
      reviews: 1100,
      mainImage: hotel3,
      subImages: [
        hotel3_1,
        hotel3_2,
        hotel3_3,
        hotel3_4,
        hotel3_5,
        hotel3_6,
        hotel3_7,
        hotel3_8,
        hotel3_9,
        hotel3_10
      ],
      amenities: ["wifi", 
        "snowflake", "ban-smoking"]
    },
    {
      id: 5,
      name: "Khách sạn Malibu Beach Vũng Tàu",
      location: "Vũng Tàu",
      stars: 5,
      address: "263 Lê Hồng Phong, Thắng Tam, Tp. Vũng Tàu",
      oldPrice: "2.100.000 đ",
      newPrice: "1.499.000 đ",
      rating: 9.1,
      reviews: 1500,
      mainImage: hotel5,
      subImages: [
        hotel5_1,
        hotel5_2,
        hotel5_3,
        hotel5_4,
        hotel5_5,
        hotel5_6,
        hotel5_7,
        hotel5_8,
        hotel5_9,
        hotel5_10
      ],
      amenities: ["wifi", "snowflake", "smoking"]
    },
    {
      id: 6,
      name: "Khách sạn Thùy Vân Vũng Tàu",
      location: "Vũng Tàu",
      stars: 2,
      address: "115 Thùy Vân, Phường 2, TP Vũng Tàu",
      oldPrice: "1.200.000 đ",
      newPrice: "899.000 đ",
      rating: 7.5,
      reviews: 420,
      mainImage: hotel6,
      subImages: [
        hotel6_1,
        hotel6_2,
        hotel6_3,
        hotel6_4,
        hotel6_5,
        hotel6_6,
        hotel6_7,
        hotel6_8,
        hotel6_9,
        hotel6_10
      ],
      amenities: ["wifi", "snowflake", "elevator"]
    },
    {
      id: 7,
      name: "Khách sạn Biển Vàng Vũng Tàu",
      location: "Vũng Tàu", 
      stars: 1,
      address: "22 Mạc Thanh Đạm, Phường 8, Vũng Tàu",
      oldPrice: "500.000 đ",
      newPrice: "345.000 đ",
      rating: 8.0,
      reviews: 120,
      mainImage: hotel7,
      subImages: [
        hotel7_1,
        hotel7_2,
        hotel7_3,
        hotel7_4,
        hotel7_5,
        hotel7_6,
        hotel7_7,
        hotel7_8,
        hotel7_9,
        hotel7_10
      ],
      amenities: ["wifi", "snowflake", "ban-smoking"]
    },
    {
      id: 8,
      name: "The Wind Mountain Boutique",
      location: "Vũng Tàu", 
      stars: 4,
      address: "98 Phan Chu Trinh, Phường 2, Vũng Tàu",
      oldPrice: "2.500.000 đ",
      newPrice: "1.804.400 đ",
      rating: 9.3,
      reviews: 650,
      mainImage: hotel8,
      subImages: [
        hotel8_1,
        hotel8_2,
        hotel8_3,
        hotel8_4,
        hotel8_5,
        hotel8_6,
        hotel8_7,
      ],
      amenities: ["wifi", "snowflake", "pool"]
    },
    {
      id: 9,
      name: "Khách sạn Mercure Vũng Tàu",
      location: "Vũng Tàu", 
      stars: 4,
      address: "03 – 06 Hạ Long, Phường 2, Vũng Tàu",
      oldPrice: "3.000.000 đ",
      newPrice: "2.499.000 đ",
      rating: 9.0,
      reviews: 1450,
      mainImage: hotel9,
      subImages: [
        hotel9_1,
        hotel9_2,
        hotel9_3,
        hotel9_4,
        hotel9_5,
        hotel9_6,
        hotel9_7,
        hotel9_8,
        hotel9_9,
        hotel9_10,
      ],
      amenities: ["wifi", "snowflake", "ban-smoking"]
    },
    {
      id: 10,
      name: "Khách sạn Riva Vũng Tàu",
      location: "Vũng Tàu", 
      stars: 4,
      address: "03-05 Thùy Vân, Phường 2, Vũng Tàu",
      oldPrice: "1.200.000 đ",
      newPrice: "750.000 đ",
      rating: 8.8,
      reviews: 320,
      mainImage: hotel10,
      subImages: [
        hotel10_1,
        hotel10_2,
        hotel10_3,
        hotel10_4,
        hotel10_5,
        hotel10_6,
        hotel10_7,
        hotel10_8,
        hotel10_9,
        hotel10_10
      ],
      
      amenities: ["wifi", "snowflake", "ban-smoking"]
    },
    {
  id: 11,
  name: "Khách sạn Đà Lạt View",
  location: "Đà Lạt",
  stars: 4,
  address: "42 Đường Đống Đa, Đà Lạt",
  oldPrice: "1.800.000 đ",
  newPrice: "1.200.000 đ",
  rating: 9.0,
  reviews: 500,
  mainImage: hotel1, // có thể tận dụng ảnh cũ
  subImages: [hotel1_2, hotel1_3, hotel1_4],
  amenities: ["wifi", "snowflake"]
},
{
  id: 12,
  name: "Resort Đà Lạt Hills",
  location: "Đà Lạt",
  stars: 5,
  address: "Đồi Robin, Đà Lạt",
  oldPrice: "3.000.000 đ",
  newPrice: "2.200.000 đ",
  rating: 9.4,
  reviews: 300,
  mainImage: hotel2,
  subImages: [hotel2_1, hotel2_2, hotel2_3],
  amenities: ["wifi", "pool"]
},
{
  id: 13,
  name: "Khách sạn Mường Thanh Đà Lạt",
  location: "Đà Lạt",
  stars: 4,
  address: "42 Phan Bội Châu, Đà Lạt",
  oldPrice: "2.200.000 đ",
  newPrice: "1.650.000 đ",
  rating: 8.9,
  reviews: 780,
  mainImage: hotel3,
  subImages: [hotel3_1, hotel3_2, hotel3_3],
  amenities: ["wifi", "pool", "snowflake"]
},
{
  id: 14,
  name: "Dalat Palace Heritage Hotel",
  location: "Đà Lạt",
  stars: 5,
  address: "2 Trần Phú, Đà Lạt",
  oldPrice: "4.500.000 đ",
  newPrice: "3.200.000 đ",
  rating: 9.6,
  reviews: 620,
  mainImage: hotel4,
  subImages: [hotel4_1, hotel4_2, hotel4_3],
  amenities: ["wifi", "pool", "concierge"]
},
{
  id: 15,
  name: "Terracotta Hotel & Resort Đà Lạt",
  location: "Đà Lạt",
  stars: 4,
  address: "Phân khu chức năng 7.9, Hồ Tuyền Lâm",
  oldPrice: "3.000.000 đ",
  newPrice: "2.100.000 đ",
  rating: 9.2,
  reviews: 950,
  mainImage: hotel5,
  subImages: [hotel5_1, hotel5_2, hotel5_3],
  amenities: ["wifi", "pool", "snowflake"]
},
{
  id: 16,
  name: "Swiss-Belresort Tuyền Lâm",
  location: "Đà Lạt",
  stars: 5,
  address: "Khu du lịch Hồ Tuyền Lâm, Đà Lạt",
  oldPrice: "3.800.000 đ",
  newPrice: "2.700.000 đ",
  rating: 9.3,
  reviews: 500,
  mainImage: hotel6,
  subImages: [hotel6_1, hotel6_2, hotel6_3],
  amenities: ["wifi", "pool", "ban-smoking"]
},
{
  id: 17,
  name: "Khách sạn Colline Đà Lạt",
  location: "Đà Lạt",
  stars: 4,
  address: "10 Phan Bội Châu, Đà Lạt",
  oldPrice: "2.500.000 đ",
  newPrice: "1.900.000 đ",
  rating: 9.1,
  reviews: 870,
  mainImage: hotel7,
  subImages: [hotel7_1, hotel7_2, hotel7_3],
  amenities: ["wifi", "snowflake"]
},
{
  id: 18,
  name: "Ladalat Hotel",
  location: "Đà Lạt",
  stars: 5,
  address: "106A Mai Anh Đào, Đà Lạt",
  oldPrice: "2.800.000 đ",
  newPrice: "2.000.000 đ",
  rating: 9.0,
  reviews: 430,
  mainImage: hotel8,
  subImages: [hotel8_1, hotel8_2, hotel8_3],
  amenities: ["wifi", "pool", "snowflake"]
},
{
  id: 19,
  name: "Ana Mandara Villas Đà Lạt",
  location: "Đà Lạt",
  stars: 5,
  address: "Lê Lai, Phường 5, Đà Lạt",
  oldPrice: "4.200.000 đ",
  newPrice: "3.000.000 đ",
  rating: 9.5,
  reviews: 350,
  mainImage: hotel9,
  subImages: [hotel9_1, hotel9_2, hotel9_3],
  amenities: ["wifi", "pool", "concierge"]
},
{
  id: 20,
  name: "The Luxe Hotel Đà Lạt",
  location: "Đà Lạt",
  stars: 3,
  address: "17 Ba Tháng Hai, Đà Lạt",
  oldPrice: "1.200.000 đ",
  newPrice: "850.000 đ",
  rating: 8.5,
  reviews: 210,
  mainImage: hotel10,
  subImages: [hotel10_1, hotel10_2, hotel10_3],
  amenities: ["wifi", "snowflake"]
}
    
  ];

  const danhSachPhuong = ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 7", "Phường 8", "Thắng Tam"];
  const phuongHienThi = showAllPhuong ? danhSachPhuong : danhSachPhuong.slice(0, 6);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
          <div className="vnbk-input-group">
            <i className="fa-solid fa-location-dot text-muted"></i>
            <input type="text" placeholder="Địa điểm hoặc tên Khách sạn" />
          </div>
          <div className="vnbk-input-group">
            <i className="fa-regular fa-calendar text-muted"></i>
            <input type="text" defaultValue="16/04/2026" />
          </div>
          <div className="vnbk-input-group">
            <i className="fa-regular fa-calendar text-muted"></i>
            <input type="text" defaultValue="17/04/2026" />
          </div>
          <div className="vnbk-input-group">
            <i className="fa-regular fa-user text-muted"></i>
            <input type="text" defaultValue="1 phòng, 1 khách" />
          </div>
          <button className="vnbk-btn-search">TÌM KIẾM</button>
        </div>
      </div>

      <div className="vnbk-main-content">
        <div className="vnbk-breadcrumbs">
          <a href="#">Trang chủ</a> » <a href="#">Khách sạn</a> » <span className="active">Khách sạn Vũng Tàu</span>
        </div>

        <div className="vnbk-layout">
          {/* CỘT TRÁI: BỘ LỌC */}
          <aside className="vnbk-sidebar">
            <div className="vnbk-filter-box">
              <h4 className="filter-title">Hạng sao</h4>
              {[5, 4, 3, 2, 1].map((star) => (
                <label className="vnbk-checkbox-item" key={star}>
                  <input type="checkbox" /> <span>{"⭐".repeat(star)}</span>
                </label>
              ))}
            </div>
            
            <div className="vnbk-filter-box">
              <h4 className="filter-title">Khu vực</h4>
              {phuongHienThi.map(p => (
                <label className="vnbk-checkbox-item" key={p}>
                  <input type="checkbox" /> <span>{p}</span>
                </label>
              ))}
              <p className="show-more" onClick={() => setShowAllPhuong(!showAllPhuong)}>
                {showAllPhuong ? "Rút gọn" : "Xem thêm"}
              </p>
            </div>
          </aside>

          {/* CỘT PHẢI: DANH SÁCH KHÁCH SẠN */}
          <main className="vnbk-results">
            <h2 className="result-title">
  Khách sạn {selectedLocation}
</h2>

            {isLoading ? (
              <div className="vnbk-skeleton">
                 <div className="skeleton-item">Đang tìm kiếm những chỗ nghỉ tốt nhất...</div>
              </div>
            ) : (
              <div className="vnbk-real-hotel-list">
                {hotelsData
  .filter(hotel => hotel.location === selectedLocation)
  .map((hotel) => (
                  <div 
                    className="vnbk-hotel-card" 
                    key={hotel.id}
                    style={{ cursor: 'pointer' }} 
                    onClick={() => goToDetail(hotel)}
                  >
                    <div className="vnbk-image-wrapper">
                      <img src={hotel.mainImage} alt={hotel.name} className="hotel-img" />
                    </div>
                    
                    <div className="hotel-info">
                      <h3>{hotel.name} <span className="stars">{"⭐".repeat(hotel.stars)}</span></h3>
                      <p><i className="fa-solid fa-location-dot"></i> {hotel.address}</p>
                      <p className="rating-text">
                        <strong>{hotel.rating}</strong> Tuyệt vời ({hotel.reviews} đánh giá)
                      </p>
                      
                      <div className="vnbk-amenities-icons">
                        {hotel.amenities.map((icon, index) => (
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
                      {hotel.oldPrice && <p className="old-price">{hotel.oldPrice}</p>}
                      <p className="new-price">{hotel.newPrice}</p>
                     <button 
  className="btn-book"
  onClick={(e) => {
    e.stopPropagation(); // ❌ tránh click lan ra card
    navigate("/booking", {
      state: {
        hotel,
        checkIn: "24/04/2026",
        checkOut: "25/04/2026",
        guests: "2 khách, 1 phòng"
      }
    });
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
    </div>
  );
};

export default SearchResults;