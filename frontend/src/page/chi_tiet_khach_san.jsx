import React, { useState, useEffect } from "react";
import "./chi_tiet_khach_san.css";

const HotelDetail = ({ hotel }) => {
  const [images, setImages] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const STATIC_BASE = API_BASE.replace(/\/api\/?$/, "");

  const fetchHotelImages = async () => {
    if (!hotel?.id) return;

    try {
      const res = await fetch(`${API_BASE}/hotels/${hotel.id}/images`);

      if (!res.ok) throw new Error("Không thể tải ảnh");

      const data = await res.json();
      // Normalize image URLs to full public URLs
      const normalized = (Array.isArray(data) ? data : []).map((img) => {
        const url = img.image_url || img.url || "";
        const publicUrl = url.startsWith("http") ? url : `${STATIC_BASE}${url}`;
        return { ...img, publicUrl };
      });
      setImages(normalized);
    } catch (err) {
      console.error("Lỗi fetch ảnh:", err);
      setImages([]);
    }
  };

  useEffect(() => {
    fetchHotelImages();
  }, [hotel?.id]);

  if (!hotel) return null;

  // Xử lý ảnh: Ưu tiên ảnh từ bảng hotel_images, nếu không có thì lấy ảnh chính trong bảng hotel
  const mainImage = images[0]?.image_url || hotel.image;
  const normalizedHotelImage = (() => {
    const img = hotel.image || "";
    if (!img) return "";
    if (img.startsWith("http")) return img;
    const pathPart = img.startsWith("/") ? img : `/${img}`;
    return `${STATIC_BASE}${pathPart}`;
  })();

  const mainImagePublic = images[0]?.publicUrl || normalizedHotelImage || "";
  const subImages = images.slice(1, 4);

  // Upload state
  const [fileToUpload, setFileToUpload] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return setFileToUpload(null);
    setFileToUpload(f);
    const reader = new FileReader();
    reader.onload = () => setPreviewSrc(reader.result);
    reader.readAsDataURL(f);
  };

  const uploadImage = async () => {
    if (!fileToUpload || !hotel?.id) return alert("Chọn ảnh trước khi tải lên");
    setUploading(true);
    try {
      // API_BASE is defined above
      const form = new FormData();
      // backend may expect field name 'image' or 'file' — adjust if needed
      form.append("image", fileToUpload);

      const res = await fetch(`${API_BASE}/api/hotels/${hotel.id}/images`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Upload thất bại");
      }

      // refresh images
      setFileToUpload(null);
      setPreviewSrc("");
      await fetchHotelImages();
      alert("Tải ảnh lên thành công");
    } catch (err) {
      console.error("Upload error", err);
      alert("Lỗi tải ảnh lên: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // expose fetch function for upload to refresh — define inside effect scope earlier? we'll create helper by moving fetchHotelImages out

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
            src={mainImagePublic || mainImage}
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
                src={img.publicUrl || img.image_url}
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

      {/* Upload form (simple) */}
      <div style={{ marginTop: 18, marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="preview"
              style={{
                width: 120,
                height: 80,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
          ) : null}
          <button
            onClick={uploadImage}
            disabled={uploading}
            style={{
              padding: "8px 12px",
              background: "#2b68c9",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {uploading ? "Đang tải..." : "Tải ảnh lên"}
          </button>
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
