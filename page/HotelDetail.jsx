import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./HotelDetail.css"; // Đảm bảo import file CSS vào đây
import React, { useState, useRef } from "react";
import img1 from "../assets/hotel5_3.jpg";
import img2 from "../assets/hotel5_4.jpg";
import img3 from "../assets/hotel5_5.jpg";
import img4 from "../assets/hotel5_6.jpg";

const HotelDetail = () => {
  
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const roomSectionRef = useRef(null);
  const location = useLocation();
  const hotel = location.state?.hotel;
  const rooms = [
  {
    name: "Phòng Deluxe Hướng Phố",
    price: hotel.newPrice,
    image: hotel.subImages?.[0] || img1,
    
  },
  {
    name: "Phòng Deluxe Hướng Biển",
    price: "1.800.000đ",
    image: hotel.subImages?.[1] || img2,
    
  },
  {
    name: "Phòng Grand Deluxe",
    price: "2.100.000đ",
    image: hotel.subImages?.[2] || img4,
   
  }
    
];
  console.log("Giá tiền nhận được là:", hotel?.newPrice);
const navigate = useNavigate();

const handleBookRoom = (room) => {
  navigate("/booking", {
    state: {
      hotel: hotel,
      room: room
    }
  });
};
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isImportantInfoOpen, setIsImportantInfoOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false); 
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const scrollToRooms = () => {
  roomSectionRef.current?.scrollIntoView({ behavior: "smooth" });
};

  const hotelGalleryData = hotel?.subImages?.map((imgUrl, index) => ({
    id: index + 1,
    url: imgUrl,
    category: "Khách sạn"
  })) || [];

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Tất cả");

  const currentMainImage = hotelGalleryData[currentImageIndex];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % hotelGalleryData.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? hotelGalleryData.length - 1 : prev - 1));
  };

  if (!hotel) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2 style={{ color: '#003580' }}>Đang tải thông tin khách sạn...</h2>
      </div>
    );
  }

  return (
    <div className="vnbk-main-content">
      
      {/* --- PHẦN 1: BREADCRUMBS --- */}
      <div className="vnbk-breadcrumbs">
        <span>Trang chủ</span> » 
        <span> Khách sạn</span> » 
        <span className="active"> {hotel.name}</span>
      </div>

      {/* --- PHẦN 2: GALLERY ẢNH --- */}
      <div className="hotel-gallery-grid">
        <div className="gallery-left">
          <img src={hotel.mainImage} alt="Main" />
        </div>
        <div className="gallery-right">
          <div className="grid-item"><img src={hotel.subImages?.[0]} alt="View 1" /></div>
          <div className="grid-item"><img src={hotel.subImages?.[1]} alt="View 2" /></div>
          <div 
            className="grid-item more-photos" 
            onClick={() => setIsGalleryOpen(true)} 
          >
             <img src={hotel.subImages?.[2]} alt="View 3" />
             <div className="overlay"><span>Xem tất cả ảnh</span></div>
          </div>
        </div>
      </div>

      {/* --- PHẦN 3: TIÊU ĐỀ & GIÁ --- */}
      <div className="detail-booking-section">
        <div>
          <div className="hotel-tag">
            KHÁCH SẠN {"⭐".repeat(hotel.stars || 0)} 
          </div>
          <h1 className="hotel-title">{hotel.name}</h1>
          <p className="hotel-address"><i className="fa-solid fa-location-dot"></i> {hotel.address}</p>
        </div>
        <div className="booking-price-info">
          <p className="price-text-highlight">
            {hotel.newPrice || "Liên hệ giá"} / đêm
          </p> 
                <button className="btn-book-now" onClick={scrollToRooms}>
  LỰA CHỌN PHÒNG
</button>
        </div>
      </div>

      {/* --- PHẦN 4: TOÀN BỘ TIỆN ÍCH --- */}
      <div className="hotel-amenities-section">
        <h3>Tiện nghi khách sạn</h3>
        
        <div className="amenities-grid">
          <div className="amenity-item"><i className="fa-solid fa-water-ladder"></i> Hồ bơi ngoài trời (quanh năm)</div>
          <div className="amenity-item"><i className="fa-solid fa-dumbbell"></i> Trung tâm thể dục</div>
          <div className="amenity-item"><i className="fa-solid fa-spa"></i> Khu vực thư giãn/spa lounge</div>
          <div className="amenity-item"><i className="fa-solid fa-utensils"></i> Nhà hàng</div>
          <div className="amenity-item"><i className="fa-solid fa-martini-glass-citrus"></i> Quầy bar</div>
          <div className="amenity-item"><i className="fa-solid fa-wifi"></i> Wifi</div>
          <div className="amenity-item"><i className="fa-solid fa-snowflake"></i> Máy lạnh</div>
          <div className="amenity-item"><i className="fa-solid fa-ban-smoking"></i> Phòng không hút thuốc</div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>
          <span className="toggle-action-btn" onClick={() => setShowAllAmenities(!showAllAmenities)}>
            {showAllAmenities ? "Thu gọn tiện ích ▲" : "Xem thêm tiện ích ▼"}
          </span>
        </div>
      </div>

      {showAllAmenities && (
        <div className="detailed-amenities">

          <div className="amenity-group">
            <div className="group-title">Tiện nghi chung</div>
            <div className="group-content grid-3">
              <div className="amenity-item"><i className="fa-solid fa-wind"></i> Máy lạnh</div>
              <div className="amenity-item"><i className="fa-solid fa-elevator"></i> Thang máy</div>
              <div className="amenity-item"><i className="fa-solid fa-users"></i> Phòng gia đình</div>
              <div className="amenity-item"><i className="fa-solid fa-coffee"></i> Cà phê/Trà tại sảnh</div>
              <div className="amenity-item"><i className="fa-solid fa-scissors"></i> Tiệm làm đẹp</div>
              <div className="amenity-item"><i className="fa-solid fa-wifi"></i> Wifi</div>
              <div className="amenity-item"><i className="fa-solid fa-ban-smoking"></i> Phòng không hút thuốc</div>
              <div className="amenity-item"><i className="fa-solid fa-concierge-bell"></i> Dịch vụ phòng</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="amenity-group">
            <div className="group-title">Tiện nghi phòng</div>
            <div className="group-content grid-3">
              <div className="amenity-item"><i className="fa-solid fa-bath"></i> Bồn tắm</div>
              <div className="amenity-item"><i className="fa-solid fa-shower"></i> Phòng tắm vòi sen</div>
              <div className="amenity-item"><i className="fa-solid fa-tv"></i> TV</div>
              <div className="amenity-item"><i className="fa-solid fa-shirt"></i> Áo choàng tắm</div>
              <div className="amenity-item"><i className="fa-solid fa-fan"></i> Điều hòa</div>
              <div className="amenity-item"><i className="fa-solid fa-wine-glass"></i> Tủ lạnh nhỏ trong phòng</div>
              <div className="amenity-item"><i className="fa-solid fa-wind"></i> Máy sấy tóc</div>
              <div className="amenity-item"><i className="fa-solid fa-bottle-water"></i> Nước đóng chai miễn phí</div>
              <div className="amenity-item"><i className="fa-solid fa-vault"></i> Két sắt</div>
              <div className="amenity-item"><i className="fa-solid fa-socks"></i> Dép đi trong nhà</div>
              <div className="amenity-item"><i className="fa-solid fa-bell"></i> Dịch vụ báo thức</div>
              <div className="amenity-item"><i className="fa-solid fa-phone"></i> Điện thoại</div>
              <div className="amenity-item"><i className="fa-solid fa-clock"></i> Đồng hồ báo thức</div>
              <div className="amenity-item"><i className="fa-solid fa-couch"></i> Ghế sofa</div>
              <div className="amenity-item"><i className="fa-solid fa-rug"></i> Giá treo quần áo</div>
              <div className="amenity-item"><i className="fa-solid fa-mug-hot"></i> Máy pha trà/cà phê</div>
              <div className="amenity-item"><i className="fa-solid fa-satellite-dish"></i> Truyền hình cáp/vệ tinh</div>
              <div className="amenity-item"><i className="fa-solid fa-closet"></i> Tủ quần áo</div>
              <div className="amenity-item"><i className="fa-solid fa-soap"></i> Vật dụng tắm rửa</div>
              <div className="amenity-item"><i className="fa-solid fa-hand-sparkles"></i> Bộ vệ sinh cá nhân</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="amenity-group">
            <div className="group-title">Hỗ trợ người khuyết tật</div>
            <div className="group-content grid-3">
              <div className="amenity-item"><i className="fa-solid fa-wheelchair"></i> Thuận tiện cho người khuyết tật</div>
              <div className="amenity-item"><i className="fa-solid fa-wheelchair-move"></i> Phù hợp cho xe lăn</div>
              <div className="amenity-item"><i className="fa-solid fa-elevator"></i> Thang máy</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="amenity-group">
            <div className="group-title">Ăn uống</div>
            <div className="group-content grid-3">
              <div className="amenity-item"><i className="fa-solid fa-utensils"></i> Nhà hàng</div>
              <div className="amenity-item"><i className="fa-solid fa-glass-cheers"></i> Quầy bar</div>
              <div className="amenity-item"><i className="fa-solid fa-bottle-water"></i> Nước suối</div>
              <div className="amenity-item"><i className="fa-solid fa-wine-bottle"></i> Rượu vang/Sâm panh</div>
              <div className="amenity-item"><i className="fa-solid fa-hot-tub"></i> Bữa sáng tại phòng</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="amenity-group">
            <div className="group-title">Dịch vụ lễ tân</div>
            <div className="group-content grid-3">
              <div className="amenity-item"><i className="fa-solid fa-user-tie"></i> Nhân viên xách hành lý</div>
              <div className="amenity-item"><i className="fa-solid fa-door-open"></i> Nhận phòng sớm</div>
              <div className="amenity-item"><i className="fa-solid fa-suitcase-rolling"></i> Giữ hành lý</div>
              <div className="amenity-item"><i className="fa-solid fa-shield-halved"></i> Bảo vệ 24h</div>
              <div className="amenity-item"><i className="fa-solid fa-key"></i> Lễ tân 24h</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="amenity-group">
            <div className="group-title">Kết nối mạng</div>
            <div className="group-content">
              <div className="amenity-item"><i className="fa-solid fa-wifi"></i> Wifi miễn phí có ở toàn bộ khách sạn</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="amenity-group">
            <div className="group-title">Dịch vụ lau dọn</div>
            <div className="group-content grid-3">
              <div className="amenity-item"><i className="fa-solid fa-broom"></i> Dọn phòng hàng ngày</div>
              <div className="amenity-item"><i className="fa-solid fa-soap"></i> Giặt ủi</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="amenity-group">
            <div className="group-title">Thư giãn và vui chơi giải trí</div>
            <div className="group-content grid-3">
              <div className="amenity-item"><i className="fa-solid fa-person-swimming"></i> Hồ bơi</div>
              <div className="amenity-item"><i className="fa-solid fa-dumbbell"></i> Phòng gym</div>
              <div className="amenity-item"><i className="fa-solid fa-hot-tub-person"></i> Khu vực thư giãn/spa lounge</div>
              <div className="amenity-item"><i className="fa-solid fa-temperature-high"></i> Phòng xông hơi</div>
              <div className="amenity-item"><i className="fa-solid fa-spa"></i> Mát-xa chân</div>
              <div className="amenity-item"><i className="fa-solid fa-umbrella-beach"></i> Khăn hồ bơi/bãi biển</div>
              <div className="amenity-item"><i className="fa-solid fa-water-ladder"></i> Hồ bơi ngoài trời (quanh năm)</div>
              <div className="amenity-item"><i className="fa-solid fa-hands-holding-child"></i> Massage</div>
              <div className="amenity-item"><i className="fa-solid fa-heart-pulse"></i> Trung tâm Spa & chăm sóc sức khỏe</div>
              <div className="amenity-item"><i className="fa-solid fa-tv"></i> Truyền hình cáp/vệ tinh</div>
              <div className="amenity-item"><i className="fa-solid fa-desktop"></i> TV</div>
              <div className="amenity-item"><i className="fa-solid fa-leaf"></i> Tiện Nghi Spa</div>
              <div className="amenity-item"><i className="fa-solid fa-weight-hanging"></i> Trung tâm thể dục</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="amenity-group">
            <div className="group-title">Ngoài trời</div>
            <div className="group-content">
              <div className="amenity-item"><i className="fa-solid fa-sun"></i> Ban công/sân hiên</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="amenity-group">
            <div className="group-title">Di chuyển</div>
            <div className="group-content">
              <div className="amenity-item"><i className="fa-solid fa-square-parking"></i> Bãi đỗ xe</div>
            </div>
          </div>

        </div>
      )} 


      {/* --- PHẦN MỚI: DANH SÁCH PHÒNG TRỐNG --- */}
    <div className="hotel-rooms-section" ref={roomSectionRef}>
  <h3 className="section-title">Các loại phòng trống</h3>

  {rooms.map((room, index) => (
    <div className="vnbk-room-card" key={index}>
      <h4 className="room-title">{room.name}</h4>

      <div className="room-card-body">
        <div className="room-info-col">
          <img src={room.image} alt={room.name} className="room-img" />

          <div className="room-specs">
            <p><i className="fa-solid fa-house"></i> {room.size}</p>
            <p><i className="fa-solid fa-bed"></i> {room.bed}</p>
            <p><i className="fa-solid fa-eye"></i> {room.view}</p>
            <p className="text-green">
              <i className="fa-solid fa-wifi"></i> Wifi miễn phí
            </p>
          </div>
        </div>

        <div className="room-offers-col">
          <h5 className="offers-title">Ưu đãi trong phòng</h5>

          <div className="offers-grid">
            <div className="offer-item">
              <i className="fa-solid fa-check text-green"></i>
              <span>Miễn phí hủy phòng</span>
            </div>
            
            <div className="offer-item">
              <i className="fa-solid fa-check text-green"></i>
              <span>Wifi miễn phí</span>
            </div>
            <div className="offer-item">
              <i className="fa-solid fa-check text-green"></i>
              <span> miễn phí đồ ăn sáng </span>
            </div>
             <div className="offer-item">
              <i className="fa-solid fa-check text-green"></i>
              <span> Miễn phí trà, cà phê, nước suối </span>
            </div>
            <div className="offer-item">
              <i className="fa-solid fa-check text-green"></i>
              <span> Dịch vụ dọn phòng, máy sấy tóc, két sắt trong phòng, dép đi trong phòng, áo choàng.</span>
            </div>
             <div className="offer-item">
              <i className="fa-solid fa-check text-green"></i>
              <span> có nhân viên phục vụ tận răng.</span>
            </div>
            <div className="offer-item">
              <i className="fa-solid fa-check text-green"></i>
              <span> khách sạn phục vụ xe đưa rước trong phạm vi 10km.</span>
            </div>
            

            
            
            
            
          </div>

          <div className="booking-action-area">
            <div style={{ flex: 1 }}>
              <div className="price-and-btn">
                <div className="price-box">
                  <p className="new-price">
                    {room.price} <span className="per-night">/ đêm</span>
                  </p>
                </div>

                <button
                  className="btn-book-room"
                  onClick={() => handleBookRoom(room)}
                >
                  ĐẶT NGAY
                </button>
              </div>

              <div className="tax-fee-note">
                Giá đã bao gồm thuế và phí
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  ))}
</div>

      <hr className="divider divider-lg" />

      {/* --- PHẦN 5: CHÍNH SÁCH KHÁCH SẠN (ACCORDION) --- */}
      <div className="hotel-policy-section">
        <h3 className="section-title">Chính sách khách sạn</h3>
        
        <div className="policy-list">
          <div className="accordion-box">
            <div className="accordion-header" onClick={() => setIsTimeOpen(!isTimeOpen)}>
              <span>Thời gian nhận trả phòng</span>
              <i className={`fa-solid ${isTimeOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
            {isTimeOpen && (
              <div className="accordion-body">
                <p><strong>Nhận phòng:</strong> 14:00 - <strong>Trả phòng:</strong> 12:00</p>
              </div>
            )}
          </div>

          <div className="accordion-box">
            <div className="accordion-header" onClick={() => setIsNoteOpen(!isNoteOpen)}>
              <span>Lưu ý khi nhận phòng</span>
              <i className={`fa-solid ${isNoteOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
            {isNoteOpen && (
              <div className="accordion-body">
                <p>- Quý khách vui lòng xuất trình giấy tờ tùy thân khi nhận phòng.</p>
              </div>
            )}
          </div>

          <div className="accordion-box">
            <div className="accordion-header" onClick={() => setIsMapOpen(!isMapOpen)}>
              <span>Hướng dẫn di chuyển</span>
              <i className={`fa-solid ${isMapOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
            {isMapOpen && (
              <div className="accordion-body">
                <p>- Cách bãi biển 5 phút đi bộ.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Box 3: THÔNG TIN QUAN TRỌNG */}
      <div className="accordion-box">
        <div className="accordion-header" onClick={() => setIsImportantInfoOpen(!isImportantInfoOpen)}>
          <span>Thông tin quan trọng</span>
          <i className={`fa-solid ${isImportantInfoOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </div>
        {isImportantInfoOpen && (
          <div className="accordion-body">
            
            <div className="info-row">
              <div className="info-label">Trẻ em và giường phụ</div>
              <div className="info-value">
                <p>• Trẻ em từ 0-11 tuổi: Sử dụng giường có sẵn miễn phí.</p>
                <p>• Khách từ 12 tuổi trở lên: Tính phí như người lớn, phải sử dụng giường phụ.</p>
                <p className="note-italic">* Phí giường phụ sẽ được thu trực tiếp tại khách sạn.</p>
              </div>
            </div>

            <hr className="divider-dashed" />

            <div className="info-row">
              <div className="info-label">Vật nuôi</div>
              <div className="info-value">
                <p>Không cho phép mang theo vật nuôi.</p>
              </div>
            </div>

            <hr className="divider-dashed" />

            <div className="info-row">
              <div className="info-label">Khác</div>
              <div className="info-value">
                <p>Khi đặt trên 5 phòng, chính sách và điều khoản bổ sung có thể được áp dụng.</p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* BOX 4: CHÍNH SÁCH HỦY PHÒNG */}
      <div className="accordion-box">
        <div className="accordion-header" onClick={() => setIsCancelOpen(!isCancelOpen)}>
          <span>Chính sách hủy phòng</span>
          <i className={`fa-solid ${isCancelOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </div>
        {isCancelOpen && (
          <div className="accordion-body">
            
            <div className="cancel-policy-group">
              <p className="cancel-policy-title">Ngày thường:</p>
              <p>- Trước 07 ngày trước khi khách đến: Miễn phí</p>
              <p>- 07 ngày đến trước 03 ngày trước khi khách đến: 50% tổng tiền phòng</p>
              <p>- Trong vòng 03 ngày trước khi khách đến: 100% tổng tiền phòng</p>
            </div>

            <div className="cancel-policy-group">
              <p className="cancel-policy-title">Ngày cuối tuần:</p>
              <p>- Trước 14 ngày trước khi khách đến: Miễn phí</p>
              <p>- 14 ngày đến trước 07 ngày trước khi khách đến: 50% tổng tiền phòng</p>
              <p>- Trong vòng 07 ngày trước khi khách đến: 100% tổng tiền phòng</p>
            </div>

            <div className="cancel-policy-group">
              <p className="cancel-policy-title">Ngày lễ:</p>
              <p>- Trước 30 ngày trước khi khách đến: Miễn phí</p>
              <p>- 30 ngày đến trước 14 ngày trước khi khách đến: 50% tổng tiền phòng</p>
              <p>- Trong vòng 14 ngày trước khi khách đến: 100% tổng tiền phòng</p>
            </div>

          </div>
        )}
      </div>

      {/* --- PHẦN GIỚI THIỆU KHÁCH SẠN --- */}
      <div className="hotel-intro-section">
        <h3 className="section-title">Giới thiệu về {hotel.name}</h3>
        
        <div className="intro-text-container">
          <p>
            Tọa lạc tại vị trí đắc địa, <strong>{hotel.name}</strong> mang đến một không gian nghỉ dưỡng đẳng cấp với sự kết hợp hoàn hảo giữa nét kiến trúc hiện đại và dịch vụ tận tâm. Khách sạn không chỉ là nơi lưu trú lý tưởng cho các chuyến công tác mà còn là điểm đến tuyệt vời cho gia đình và cặp đôi trong những kỳ nghỉ dài.
          </p>
          
          <p className={isIntroExpanded ? "intro-text-full" : "intro-text-clamp"}>
            Hệ thống phòng nghỉ tại đây được thiết kế tinh tế, trang bị đầy đủ tiện nghi từ máy lạnh, truyền hình cáp đến bồn tắm riêng biệt, giúp quý khách tận hưởng sự thoải mái tối đa. Đặc biệt, nhà hàng trong khuôn viên phục vụ đa dạng các món ẩm thực đặc sắc từ địa phương đến quốc tế, được chế biến bởi những đầu bếp giàu kinh nghiệm. Quý khách cũng có thể thư giãn tại hồ bơi ngoài trời hoặc trải nghiệm các dịch vụ chăm sóc sức khỏe chuyên nghiệp tại khu vực Spa. Với đội ngũ nhân viên lễ tân trực 24h luôn sẵn sàng hỗ trợ, chúng tôi cam kết mang lại cho bạn một kỳ nghỉ đáng nhớ và trọn vẹn nhất.
          </p>

          <div className="toggle-intro-btn" onClick={() => setIsIntroExpanded(!isIntroExpanded)}>
            {isIntroExpanded ? "Thu gọn ▲" : "Xem thêm ▼"}
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Nút Back to top */}
      <div className="back-to-top-btn" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        <img src="https://cdn-icons-png.flaticon.com/512/784/784844.png" alt="Back to top" />
        <div className="back-to-top-text">BACK TO TOP</div>
      </div>

      {/* MODAL GALLERY */}
      {isGalleryOpen && (
        <div className="vnbk-gallery-overlay" onClick={() => setIsGalleryOpen(false)}>
          <div className="vnbk-gallery-content" onClick={(e) => e.stopPropagation()}>
            <button className="vnbk-close-gallery" onClick={() => setIsGalleryOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="vnbk-main-image-viewport">
              <button className="vnbk-nav-btn vnbk-prev" onClick={prevImage}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              <img src={currentMainImage?.url} alt="Main View" />
              
              <div className="vnbk-overlay-text-bottom">
                <span className="vnbk-img-label">{currentMainImage?.category}</span>
                <span className="vnbk-img-count">{currentImageIndex + 1} / {hotelGalleryData.length}</span>
              </div>

              <button className="vnbk-nav-btn vnbk-next" onClick={nextImage}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <div className="vnbk-gallery-tabs">
              <button 
                className={`vnbk-tab-item ${activeTab === 'Tất cả' ? 'active' : ''}`} 
                onClick={() => setActiveTab('Tất cả')}
              >
                Tất cả ({hotelGalleryData.length})
              </button>
            </div>

            <div className="vnbk-thumbnail-strip">
              {hotelGalleryData.map((img, index) => (
                <div 
                  key={img.id} 
                  className={`vnbk-thumb-box ${index === currentImageIndex ? 'selected' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={img.url} alt={`Thumb ${img.id}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HotelDetail;
 