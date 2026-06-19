import React, { useEffect, useState, useCallback } from "react";
import "./chi_tiet_khach_san.css";

const ChiTietKhachSan = ({ hotel }) => {
  const [images, setImages] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [uploading, setUploading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const STATIC_BASE = API_BASE.replace(/\/api\/?$/, "");

  const makePublicUrl = useCallback(
    (url = "") => {
      if (!url) return "";
      if (url.startsWith("http")) return url;
      // ensure leading slash
      const pathPart = url.startsWith("/") ? url : `/${url}`;
      return `${STATIC_BASE}${pathPart}`;
    },
    [STATIC_BASE],
  );

  const fetchImages = useCallback(
    async (hotelId) => {
      if (!hotelId) {
        setImages([]);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/hotels/${hotelId}/images`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map((img) => {
          const raw = img.image_url || img.url || "";
          return { ...img, publicUrl: makePublicUrl(raw) };
        });
        setImages(normalized);
      } catch (err) {
        console.error("Error fetching hotel images:", err);
        setImages([]);
      }
    },
    [API_BASE, makePublicUrl],
  );

  useEffect(() => {
    fetchImages(hotel?.id);
  }, [hotel?.id, fetchImages]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFileToUpload(f);
    if (!f) return setPreviewSrc("");
    const reader = new FileReader();
    reader.onload = () => setPreviewSrc(reader.result);
    reader.readAsDataURL(f);
  };

  const uploadImage = async () => {
    if (!fileToUpload || !hotel?.id) {
      alert("Chọn ảnh và đảm bảo đã chọn khách sạn.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", fileToUpload); // backend expects "image"
      const res = await fetch(`${API_BASE}/hotels/${hotel.id}/images`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Upload failed (${res.status})`);
      }
      // clear and refresh
      setFileToUpload(null);
      setPreviewSrc("");
      await fetchImages(hotel.id);
      alert("Tải ảnh lên thành công");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Lỗi tải ảnh lên: " + (err.message || err));
    } finally {
      setUploading(false);
    }
  };

  if (!hotel) return null;

  const mainImagePublic =
    images[0]?.publicUrl ||
    (hotel.image ? makePublicUrl(hotel.image) : "") ||
    "";

  const subImages = images.slice(1, 4);

  return (
    <div className="vnbk-main-content" style={{ paddingTop: 10 }}>
      <div
        className="vnbk-breadcrumbs"
        style={{ marginBottom: 20, fontSize: 13 }}
      >
        <span>Trang chủ</span> » <span>Khách sạn</span> » <span>Việt Nam</span>{" "}
        »
        <span className="active" style={{ fontWeight: "bold", marginLeft: 6 }}>
          {hotel.name}
        </span>
      </div>

      <div className="hotel-gallery-grid">
        <div className="gallery-left">
          <img
            src={mainImagePublic}
            alt={hotel.name || "Hotel"}
            onError={(e) => {
              // final fallback: placeholder image
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://via.placeholder.com/800x400?text=No+Image";
            }}
            style={{
              width: "100%",
              height: 400,
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
        </div>

        <div className="gallery-right">
          {subImages.map((img) => (
            <div
              className="grid-item"
              key={img.id || img.publicUrl || Math.random()}
            >
              <img
                src={img.publicUrl}
                alt="thumb"
                onError={(e) => {
                  // hide broken thumbnail
                  e.currentTarget.style.display = "none";
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </div>
          ))}
        </div>
      </div>

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
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Đang tải..." : "Tải ảnh lên"}
          </button>
        </div>
      </div>

      <div className="detail-header-info" style={{ marginTop: 25 }}>
        <h1 style={{ color: "#003580", fontSize: 26, margin: "0 0 10px 0" }}>
          {hotel.name}{" "}
          <span style={{ fontSize: 18 }}>{"⭐".repeat(hotel.stars || 0)}</span>
        </h1>
        <p style={{ color: "#555", fontSize: 15 }}>
          <i
            className="fa-solid fa-location-dot"
            style={{ marginRight: 8 }}
          ></i>
          {hotel.address}
        </p>
      </div>
    </div>
  );
};

export default ChiTietKhachSan;
