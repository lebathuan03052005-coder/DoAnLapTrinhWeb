import React from "react";

// Tách riêng Component Chi tiết để dễ quản lý
const HotelDetail = ({ hotel }) => {
  if (!hotel) return null;

  return (
    <div className="vnbk-main-content" style={{ paddingTop: '10px' }}>
      
      {/* 1. Breadcrumb chi tiết */}
      <div className="vnbk-breadcrumbs" style={{ marginBottom: '20px', fontSize: '13px' }}>
        <span style={{ cursor: 'pointer', color: '#0057b8', fontWeight: 'bold' }}>Trang chủ</span> » 
        <span style={{ cursor: 'pointer', color: '#0057b8', fontWeight: 'bold' }}> Khách sạn</span> » 
        <span style={{ cursor: 'pointer', color: '#0057b8', fontWeight: 'bold' }}> Việt Nam</span> » 
        <span style={{ cursor: 'pointer', color: '#0057b8', fontWeight: 'bold' }}> Bà Rịa Vũng Tàu</span> » 
        <span style={{ cursor: 'pointer', color: '#0057b8', fontWeight: 'bold' }}> Vũng Tàu</span> » 
        <span style={{ cursor: 'pointer', color: '#0057b8', fontWeight: 'bold' }}> Phường 8</span> » 
        <span style={{ cursor: 'pointer', color: '#0057b8', fontWeight: 'bold' }}> Thùy Vân</span> » 
        <span className="active" style={{ color: '#333', fontWeight: 'bold' }}> {hotel.name}</span>
      </div>

      {/* 2. Gallery ảnh */}
      <div className="hotel-gallery-grid">
        <div className="gallery-left">
          <img src={hotel.mainImage} alt="Main" />
        </div>
        <div className="gallery-right">
          <div className="grid-item">
            <img src={hotel.subImages?.[0]} alt="View 1" />
          </div>
          <div className="grid-item">
            <img src={hotel.subImages?.[1]} alt="View 2" />
          </div>
          <div className="grid-item more-photos">
             <img src={hotel.subImages?.[2]} alt="View 3" />
             <div className="overlay"><span>Xem tất cả ảnh</span></div>
          </div>
        </div>
      </div>

      {/* 3. Thông tin tiêu đề */}
      <div className="detail-header-info" style={{ marginTop: '25px' }}>
        <h1 style={{ color: '#003580', fontSize: '26px', margin: '0 0 10px 0' }}>
          {hotel.name} <span style={{fontSize:'18px'}}>{"⭐".repeat(hotel.stars)}</span>
        </h1>
        <p style={{ color: '#555', fontSize: '15px' }}>
          <i className="fa-solid fa-location-dot" style={{marginRight: '8px', color: '#888'}}></i> 
          {hotel.address}
        </p>
      </div>
      {/* 4. MODAL GALLERY - ĐOẠN NÀY CHỈ HIỆN KHI isGalleryOpen = true */}
      {isGalleryOpen && (
        <div className="vnbk-gallery-overlay" onClick={() => setIsGalleryOpen(false)}>
          <div className="vnbk-gallery-content" onClick={(e) => e.stopPropagation()}>
            {/* Nút Đóng (X) */}
            <button className="vnbk-close-gallery" onClick={() => setIsGalleryOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* PHẦN 1: ẢNH CHÍNH LỚN */}
            <div className="vnbk-main-image-viewport">
              {/* Nút Prev */}
              <button className="vnbk-nav-btn vnbk-prev" onClick={prevImage}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              <img src={currentMainImage.url} alt="Main View" />
              
              {/* Text overlays */}
              <div className="vnbk-overlay-text-bottom">
                <span className="vnbk-img-label">{currentMainImage.category}</span>
                <span className="vnbk-img-count">{currentImageIndex + 1} / {hotelGalleryData.length}</span>
              </div>

              {/* Nút Next */}
              <button className="vnbk-nav-btn vnbk-next" onClick={nextImage}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            {/* PHẦN 2: THANH TAB FILTER */}
            <div className="vnbk-gallery-tabs">
              <button className={`vnbk-tab-item ${activeTab === 'Tất cả (10)' ? 'active' : ''}`} onClick={() => setActiveTab('Tất cả (10)')}>Tất cả (10)</button>
              <button className={`vnbk-tab-item ${activeTab === 'Khách sạn (10)' ? 'active' : ''}`} onClick={() => setActiveTab('Khách sạn (10)')}>Khách sạn (10)</button>
            </div>

            {/* PHẦN 3: DANH SÁCH ẢNH NHỎ (THUMBNAILS) */}
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