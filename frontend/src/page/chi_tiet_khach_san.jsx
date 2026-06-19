import React, { useState, useEffect } from "react";
import "./chi_tiet_khach_san.css";

const HotelDetail = ({ hotel }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchHotelImages = async () => {
      if (!hotel?.id) return;

      try {
        const baseUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${baseUrl}/api/hotels/${hotel.id}/images`);

        if (!res.ok) throw new Error("Không thể tải ảnh");

        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Lỗi fetch ảnh:", err);
        setImages([]);
      }
    };

    fetchHotelImages();
  }, [hotel?.id]);

  if (!hotel) return null;

  // Xử lý ảnh: Ưu tiên ảnh từ bảng hotel_images, nếu không có thì lấy ảnh chính trong bảng hotel
  const mainImage = images[0]?.image_url || hotel.image;
  const subImages = images.slice(1, 4);

  return (
    <div className="vnbk-main-content" style={{ paddingTop: "10px" }}>
      {/* 1. Breadcrumb */}
      <div
        className="vnbk-breadcrumbs"
        style={{ marginBottom: "20px", fontSize: "13px" }}
      >
        <span>Trang chủ</span> » <span>Khách sạn</span> » <span>Việt Nam</span>{" "}
        »
        <span className="active" style={{ fontWeight: "bold" }}>
          {" "}
          {hotel.name}
        </span>
      </div>

      {/* 2. Ảnh chính & Gallery */}
      <div className="hotel-gallery-grid">
        <div className="gallery-left">
          <img
            src={mainImage}
            alt={hotel.name}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x400?text=No+Image";
            }}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        </div>
        <div className="gallery-right">
          {subImages.map((img) => (
            <div className="grid-item" key={img.id}>
              <img
                src={img.image_url}
                alt="Hotel view"
                onError={(e) => {
                  e.target.style.display = "none";
                }} // Ẩn nếu ảnh phụ bị lỗi
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Thông tin tiêu đề */}
      <div className="detail-header-info" style={{ marginTop: "25px" }}>
        <h1
          style={{ color: "#003580", fontSize: "26px", margin: "0 0 10px 0" }}
        >
          {hotel.name}{" "}
          <span style={{ fontSize: "18px" }}>
            {"⭐".repeat(hotel.stars || 0)}
          </span>
        </h1>
        <p style={{ color: "#555", fontSize: "15px" }}>
          <i
            className="fa-solid fa-location-dot"
            style={{ marginRight: "8px" }}
          ></i>
          {hotel.address}
        </p>
      </div>
    </div>
  );
};

export default HotelDetail;
