import React, { useState, useEffect } from "react";
import formatCurrency from "../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy user từ localStorage (do bạn của bạn làm)
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    // Kiểm tra user sớm để tránh chạy fetch không cần thiết
    if (!user?.id) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      setLoading(true); // Đảm bảo trạng thái loading được bật
      try {
        // Dùng biến môi trường cho URL Backend
        const baseUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        const res = await fetch(`${baseUrl}/bookings/user/${user.id}`);

        // Kiểm tra phản hồi từ server
        if (!res.ok) throw new Error("Không thể tải danh sách đặt phòng");

        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi lấy đặt phòng:", err);
        setBookings([]); // Reset dữ liệu khi có lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id, navigate]); // Thêm dependencies để tránh warning từ React

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { color: "#f59e0b", label: "🟡 Đang chờ xác nhận" };
      case "confirmed":
        return { color: "#10b981", label: "✅ Đã xác nhận" };
      case "cancelled":
        return { color: "#ef4444", label: "❌ Đã hủy" };
      case "completed":
        return { color: "#3b82f6", label: "✔️ Hoàn thành" };
      default:
        return { color: "#888", label: status };
    }
  };

  if (loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>Đang tải...</div>
    );

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ color: "#003580", marginBottom: "24px" }}>
        <i
          className="fa-solid fa-calendar-check"
          style={{ marginRight: "10px" }}
        ></i>
        Đặt Phòng Của Tôi
      </h2>

      {bookings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            background: "#f9f9f9",
            borderRadius: "12px",
          }}
        >
          <i
            className="fa-solid fa-bed"
            style={{ fontSize: "48px", color: "#ccc" }}
          ></i>
          <p style={{ color: "#888", marginTop: "16px" }}>
            Bạn chưa có đặt phòng nào
          </p>
          <button
            onClick={() => navigate("/search")}
            style={{
              marginTop: "16px",
              padding: "10px 24px",
              background: "#ef5b25",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Tìm khách sạn ngay
          </button>
        </div>
      ) : (
        bookings.map((booking) => {
          const status = getStatusColor(booking.status);
          return (
            <div
              key={booking.id}
              style={{
                display: "flex",
                gap: "20px",
                background: "white",
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {/* Ảnh khách sạn */}
              <img
                src={booking.hotel_image}
                alt={booking.hotel_name}
                style={{
                  width: "120px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  flexShrink: 0,
                }}
              />

              {/* Thông tin */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    color: "#003580",
                    margin: "0 0 6px 0",
                    fontSize: "16px",
                  }}
                >
                  {booking.hotel_name}
                </h3>
                <p
                  style={{
                    color: "#555",
                    fontSize: "13px",
                    margin: "0 0 4px 0",
                  }}
                >
                  <i
                    className="fa-solid fa-bed"
                    style={{ marginRight: "6px" }}
                  ></i>
                  {booking.room_name}
                </p>
                <p
                  style={{
                    color: "#555",
                    fontSize: "13px",
                    margin: "0 0 4px 0",
                  }}
                >
                  <i
                    className="fa-regular fa-calendar"
                    style={{ marginRight: "6px" }}
                  ></i>
                  {new Date(booking.check_in_date).toLocaleDateString("vi-VN")}{" "}
                  →{" "}
                  {new Date(booking.check_out_date).toLocaleDateString("vi-VN")}
                </p>
                <p style={{ color: "#555", fontSize: "13px", margin: "0" }}>
                  <i
                    className="fa-solid fa-phone"
                    style={{ marginRight: "6px" }}
                  ></i>
                  {booking.guest_phone}
                </p>
              </div>

              {/* Giá & Trạng thái */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p
                  style={{
                    color: "#ef5b25",
                    fontWeight: "bold",
                    fontSize: "16px",
                    margin: "0 0 8px 0",
                  }}
                >
                  {formatCurrency(booking.total_amount)} VND
                </p>
                <span
                  style={{
                    color: status.color,
                    fontWeight: "600",
                    fontSize: "13px",
                    background: `${status.color}15`,
                    padding: "4px 10px",
                    borderRadius: "20px",
                  }}
                >
                  {status.label}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyBookings;
