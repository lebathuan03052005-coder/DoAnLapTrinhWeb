import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import "./HotelDetail.css";
import React, { useState, useEffect, useRef } from "react";
import img1 from "../assets/hinh_1.png";


const HotelDetail = () => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [hotelData, setHotelData] = useState(null);
  const [loadingHotel, setLoadingHotel] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [errorRooms, setErrorRooms] = useState(null);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isImportantInfoOpen, setIsImportantInfoOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const [images, setImages] = useState([]);
  const roomSectionRef = useRef(null);

  const location = useLocation();
  const { hotelId } = useParams();
  const hotel = location.state?.hotel || hotelData;
  const checkIn = location.state?.checkInDate || "16/04/2026";
  const checkOut = location.state?.checkOutDate || "17/04/2026";
  const guests = location.state?.guests || "2 khách, 1 phòng";
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const openImage = (url) => {
  setSelectedImage(url);
};
  const navigate = useNavigate();

  // Fetch hotel data từ URL params nếu không có state
  useEffect(() => {
    if (!location.state?.hotel && hotelId) {
      setLoadingHotel(true);
      fetch(`http://localhost:5000/api/hotels/${hotelId}`)
        .then(res => res.json())
        .then(data => {
          console.log("🖼️ Images:", data);
          setHotelData(data);
          setLoadingHotel(false);
        })
        .catch(err => {
          console.error("Lỗi lấy thông tin khách sạn:", err);
          setLoadingHotel(false);
        });
    }
  }, [hotelId, location.state]);

  useEffect(() => {
  const fetchRooms = async () => {
    setLoadingRooms(true);
    setErrorRooms(null);
    try {
      const res = await fetch(`http://localhost:5000/api/room-types/${hotel.id}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      if (!data || data.length === 0) {
        setErrorRooms("Khách sạn này hiện không có phòng trống");
      }
      setRooms(data || []);
    } catch (err) {
      console.error("❌ Lỗi lấy phòng:", err);
      setErrorRooms("Không thể tải danh sách phòng. Vui lòng thử lại.");
    } finally {
      setLoadingRooms(false);
    }
  };

  if (hotel?.id) fetchRooms();
}, [hotel?.id]);
useEffect(() => {
  const fetchImages = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/hotels/${hotel.id}/images`);
      const data = await res.json();
      console.log("🖼️ Images:", data);
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi lấy ảnh:", err);
    }
  };
  if (hotel?.id) fetchImages();
}, [hotel?.id]);
// ← THÊM ĐOẠN NÀY NGAY BÊN DƯỚI

  const calculatedPrice = hotel?.price
    ? Math.round(hotel.price * (1 - (hotel.discount || 0) / 100))
    : null;

  if (!hotel || loadingHotel) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2 style={{ color: '#003580' }}>Đang tải thông tin khách sạn...</h2>
      </div>
    );
  }

  const scrollToRooms = () => {
    roomSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBookRoom = (room) => {
    navigate("/booking", {
      state: { hotel, room, checkIn, checkOut, guests }
    });
  };
const nextImage = () => {
  setCurrentImageIndex((prev) => (prev + 1) % images.length);
};

const prevImage = () => {
  setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
};
  return (
    <div className="vnbk-main-content">

      {/* PHẦN 1: BREADCRUMBS */}
      <div className="vnbk-breadcrumbs">
        <span>Trang chủ</span> » 
        <span> Khách sạn</span> » 
        <span className="active"> {hotel.name}</span>
      </div>

      {/* PHẦN 2: GALLERY ẢNH */}
{/* PHẦN 2: GALLERY ẢNH */}
{/* PHẦN 2: GALLERY ẢNH */}
<div className="hotel-gallery-grid">
  <div className="gallery-left" onClick={() => { setCurrentImageIndex(0); setIsGalleryOpen(true); }} style={{ cursor: 'pointer' }}>
    <img src={`http://localhost:5000${images[0]?.image_url || hotel.image}`} alt="Main" />
  </div>
  <div className="gallery-right">
    <div className="grid-item" onClick={() => { setCurrentImageIndex(1); setIsGalleryOpen(true); }} style={{ cursor: 'pointer' }}>
      <img src={`http://localhost:5000${images[1]?.image_url || hotel.image}`} alt="View 1" />
    </div>
    <div className="grid-item" onClick={() => { setCurrentImageIndex(2); setIsGalleryOpen(true); }} style={{ cursor: 'pointer' }}>
      <img src={`http://localhost:5000${images[2]?.image_url || hotel.image}`} alt="View 2" />
    </div>
    <div className="grid-item more-photos" onClick={() => { setCurrentImageIndex(3); setIsGalleryOpen(true); }} style={{ cursor: 'pointer' }}>
      <img src={`http://localhost:5000${images[3]?.image_url || hotel.image}`} alt="View 3" />
      <div className="overlay">
        <span>Xem tất cả {images.length} ảnh</span>
      </div>
    </div>
  </div>
</div>

      {/* PHẦN 3: TIÊU ĐỀ & GIÁ */}
      <div className="detail-booking-section">
        <div>
          <div className="hotel-tag">
            KHÁCH SẠN {"⭐".repeat(hotel.stars || 0)}
          </div>
          <h1 className="hotel-title">{hotel.name}</h1>
          <p className="hotel-address">
            <i className="fa-solid fa-location-dot"></i> {hotel.address}
          </p>
        </div>
        <div className="booking-price-info">
          <p className="price-text-highlight">
            {calculatedPrice ? calculatedPrice.toLocaleString('vi-VN') + ' VND' : "Liên hệ giá"} / đêm
          </p>
          <button className="btn-book-now" onClick={() => {
            setShowRooms(true);
            setTimeout(() => scrollToRooms(), 100);
          }}>
            LỰA CHỌN PHÒNG
          </button>
        </div>
      </div>

      {/* PHẦN 4: TIỆN ÍCH */}
      <div className="hotel-amenities-section">
        <h3>Tiện nghi khách sạn</h3>
        <div className="amenities-grid">
          <div className="amenity-item"><i className="fa-solid fa-water-ladder"></i> Hồ bơi ngoài trời</div>
          <div className="amenity-item"><i className="fa-solid fa-dumbbell"></i> Trung tâm thể dục</div>
          <div className="amenity-item"><i className="fa-solid fa-spa"></i> Spa lounge</div>
          <div className="amenity-item"><i className="fa-solid fa-utensils"></i> Nhà hàng</div>
          <div className="amenity-item"><i className="fa-solid fa-martini-glass-citrus"></i> Quầy bar</div>
          <div className="amenity-item"><i className="fa-solid fa-wifi"></i> Wifi</div>
          <div className="amenity-item"><i className="fa-solid fa-snowflake"></i> Máy lạnh</div>
          <div className="amenity-item"><i className="fa-solid fa-ban-smoking"></i> Không hút thuốc</div>
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
              <div className="amenity-item"><i className="fa-solid fa-wifi"></i> Wifi</div>
              <div className="amenity-item"><i className="fa-solid fa-ban-smoking"></i> Phòng không hút thuốc</div>
              <div className="amenity-item"><i className="fa-solid fa-concierge-bell"></i> Dịch vụ phòng</div>
              <div className="amenity-item"><i className="fa-solid fa-coffee"></i> Cà phê/Trà tại sảnh</div>
            </div>
          </div>
          <hr className="divider" />
          <div className="amenity-group">
            <div className="group-title">Tiện nghi phòng</div>
            <div className="group-content grid-3">
              <div className="amenity-item"><i className="fa-solid fa-bath"></i> Bồn tắm</div>
              <div className="amenity-item"><i className="fa-solid fa-shower"></i> Vòi sen</div>
              <div className="amenity-item"><i className="fa-solid fa-tv"></i> TV</div>
              <div className="amenity-item"><i className="fa-solid fa-wind"></i> Máy sấy tóc</div>
              <div className="amenity-item"><i className="fa-solid fa-bottle-water"></i> Nước miễn phí</div>
              <div className="amenity-item"><i className="fa-solid fa-vault"></i> Két sắt</div>
              <div className="amenity-item"><i className="fa-solid fa-mug-hot"></i> Máy pha cà phê</div>
              <div className="amenity-item"><i className="fa-solid fa-couch"></i> Ghế sofa</div>
            </div>
          </div>
          <hr className="divider" />
          <div className="amenity-group">
            <div className="group-title">Ăn uống</div>
            <div className="group-content grid-3">
              <div className="amenity-item"><i className="fa-solid fa-utensils"></i> Nhà hàng</div>
              <div className="amenity-item"><i className="fa-solid fa-glass-cheers"></i> Quầy bar</div>
              <div className="amenity-item"><i className="fa-solid fa-hot-tub"></i> Bữa sáng tại phòng</div>
            </div>
          </div>
          <hr className="divider" />
          <div className="amenity-group">
            <div className="group-title">Thư giãn</div>
            <div className="group-content grid-3">
              <div className="amenity-item"><i className="fa-solid fa-person-swimming"></i> Hồ bơi</div>
              <div className="amenity-item"><i className="fa-solid fa-dumbbell"></i> Phòng gym</div>
              <div className="amenity-item"><i className="fa-solid fa-spa"></i> Spa</div>
              <div className="amenity-item"><i className="fa-solid fa-temperature-high"></i> Xông hơi</div>
            </div>
          </div>
          <hr className="divider" />
          <div className="amenity-group">
            <div className="group-title">Dịch vụ lễ tân</div>
            <div className="group-content grid-3">
              <div className="amenity-item"><i className="fa-solid fa-key"></i> Lễ tân 24h</div>
              <div className="amenity-item"><i className="fa-solid fa-shield-halved"></i> Bảo vệ 24h</div>
              <div className="amenity-item"><i className="fa-solid fa-suitcase-rolling"></i> Giữ hành lý</div>
              <div className="amenity-item"><i className="fa-solid fa-square-parking"></i> Bãi đỗ xe</div>
            </div>
          </div>
        </div>
      )}

      {/* PHẦN 5: DANH SÁCH PHÒNG */}
      <div className="hotel-rooms-section" ref={roomSectionRef} style={{ display: showRooms ? 'block' : 'none' }}>
        <h3 className="section-title">Các loại phòng trống</h3>
        {errorRooms ? (
          <div style={{ color: '#d32f2f', textAlign: 'center', padding: '30px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
            <p>{errorRooms}</p>
          </div>
        ) : loadingRooms ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>
            <i className="fa-solid fa-spinner fa-spin"></i> Đang tải danh sách phòng...
          </p>
        ) : rooms.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>
            Không có phòng trống khả dụng
          </p>
        ) : (
          rooms.map((room, index) => (
            <div className="vnbk-room-card" key={index}>
              <h4 className="room-title">{room.name}</h4>
              <div className="room-card-body">
                <div className="room-info-col">
                  <img
                    src={room.image ? room.image.split('\n')[0].trim() : img1}
                    alt={room.name}
                    style={{ width: '100%', borderRadius: '8px', marginBottom: '12px' }}
                  />
                  <div className="room-specs">
                    <p><i className="fa-solid fa-users"></i> Sức chứa: {room.capacity} người</p>
                    <p><i className="fa-solid fa-bed"></i> {room.bed_type}</p>
                    <p><i className="fa-solid fa-eye"></i> {room.view_type}</p>
                    {room.has_bathtub && <p><i className="fa-solid fa-bath"></i> Có bồn tắm</p>}
                    <p className="text-green"><i className="fa-solid fa-wifi"></i> Wifi miễn phí</p>
                  </div>
                </div>
                <div className="room-offers-col">
                  <h5 className="offers-title">Mô tả phòng</h5>
                  <p style={{ fontSize: '14px', color: '#555', marginBottom: '15px' }}>{room.description}</p>
                  {room.amenities && (
                    <div className="offers-grid">
                      {(typeof room.amenities === 'string'
                        ? JSON.parse(room.amenities)
                        : room.amenities
                      ).map((item, i) => (
                        <div className="offer-item" key={i}>
                          <i className="fa-solid fa-check text-green"></i>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="booking-action-area">
                    <div style={{ flex: 1 }}>
                      <div className="price-and-btn">
                        <div className="price-box">
                          <p className="new-price">
                            {formatCurrency(room.base_price)} đ
                            <span className="per-night"> / đêm</span>
                          </p>
                        </div>
                        <button className="btn-book-room" onClick={() => handleBookRoom(room)}>
                          ĐẶT NGAY
                        </button>
                      </div>
                      <div className="tax-fee-note">Giá đã bao gồm thuế và phí</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <hr className="divider divider-lg" />

      {/* PHẦN 6: CHÍNH SÁCH */}
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
                <p>• Khách từ 12 tuổi trở lên: Tính phí như người lớn.</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Vật nuôi</div>
              <div className="info-value"><p>Không cho phép mang theo vật nuôi.</p></div>
            </div>
            <div className="info-row">
              <div className="info-label">Khác</div>
              <div className="info-value"><p>Khi đặt trên 5 phòng, chính sách bổ sung có thể được áp dụng.</p></div>
            </div>
          </div>
        )}
      </div>

      <div className="accordion-box">
        <div className="accordion-header" onClick={() => setIsCancelOpen(!isCancelOpen)}>
          <span>Chính sách hủy phòng</span>
          <i className={`fa-solid ${isCancelOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </div>
        {isCancelOpen && (
          <div className="accordion-body">
            <div className="cancel-policy-group">
              <p className="cancel-policy-title">Ngày thường:</p>
              <p>- Trước 07 ngày: Miễn phí</p>
              <p>- 07 đến 03 ngày: 50% tổng tiền phòng</p>
              <p>- Trong vòng 03 ngày: 100% tổng tiền phòng</p>
            </div>
            <div className="cancel-policy-group">
              <p className="cancel-policy-title">Ngày cuối tuần:</p>
              <p>- Trước 14 ngày: Miễn phí</p>
              <p>- 14 đến 07 ngày: 50% tổng tiền phòng</p>
              <p>- Trong vòng 07 ngày: 100% tổng tiền phòng</p>
            </div>
            <div className="cancel-policy-group">
              <p className="cancel-policy-title">Ngày lễ:</p>
              <p>- Trước 30 ngày: Miễn phí</p>
              <p>- 30 đến 14 ngày: 50% tổng tiền phòng</p>
              <p>- Trong vòng 14 ngày: 100% tổng tiền phòng</p>
            </div>
          </div>
        )}
      </div>

      {/* PHẦN 7: GIỚI THIỆU */}
      <div className="hotel-intro-section">
        <h3 className="section-title">Giới thiệu về {hotel.name}</h3>
        <div className="intro-text-container">
          <p>
            Tọa lạc tại vị trí đắc địa, <strong>{hotel.name}</strong> mang đến không gian nghỉ dưỡng đẳng cấp với kiến trúc hiện đại và dịch vụ tận tâm.
          </p>
          <p className={isIntroExpanded ? "intro-text-full" : "intro-text-clamp"}>
            Hệ thống phòng nghỉ được thiết kế tinh tế, trang bị đầy đủ tiện nghi. Nhà hàng phục vụ đa dạng ẩm thực địa phương và quốc tế. Quý khách có thể thư giãn tại hồ bơi ngoài trời hoặc Spa chuyên nghiệp. Đội ngũ lễ tân 24h luôn sẵn sàng hỗ trợ.
          </p>
          <div className="toggle-intro-btn" onClick={() => setIsIntroExpanded(!isIntroExpanded)}>
            {isIntroExpanded ? "Thu gọn ▲" : "Xem thêm ▼"}
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Nút Back to top */}
      <div className="back-to-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img src="https://cdn-icons-png.flaticon.com/512/784/784844.png" alt="Back to top" />
        <div className="back-to-top-text">BACK TO TOP</div>
      </div>
{/* PHẦN 2: GALLERY ẢNH */}
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
              <img
              src={`http://localhost:5000${images[currentImageIndex]?.image_url}`}
  
  alt="Main View"
  onError={() => {
    console.log(
      "ẢNH LỚN BỊ LỖI:",
      currentImageIndex,
      images[currentImageIndex]?.image_url
    );
  }}
/>
              <div className="vnbk-overlay-text-bottom">
                <span className="vnbk-img-label">Khách sạn</span>
                <span className="vnbk-img-count">{currentImageIndex + 1} / {images.length}</span>
              </div>
              <button className="vnbk-nav-btn vnbk-next" onClick={nextImage}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <div className="vnbk-thumbnail-strip">
  {images.map((img, index) => (
    <div
      key={img.id}
      className={`vnbk-thumb-box ${index === currentImageIndex ? 'selected' : ''}`}
      onClick={() => setCurrentImageIndex(index)}
    >
        <img
         src={`http://localhost:5000${img.image_url}`}
    
          alt={`Thumb ${index + 1}`}
          onError={() => {
            console.log("ẢNH BỊ LỖI:", index, img.image_url);
          }}
      />
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