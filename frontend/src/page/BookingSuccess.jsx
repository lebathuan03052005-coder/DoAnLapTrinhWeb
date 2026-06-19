import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSuccess.css";

const BookingSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookingId, hotel, room } = state || {};

  return (
    <div className="success-wrapper">

      <div className="success-icon">🎉</div>

      <h2 className="success-title">Đặt phòng thành công!</h2>

      <p className="success-booking-id">
        Mã đặt phòng của bạn: <strong>#{bookingId}</strong>
      </p>

      {hotel && (
        <div className="success-card">
          <p className="hotel-name">{hotel.name}</p>
          <p className="hotel-address">📍 {hotel.address}</p>
          {room && (
            <p className="room-info">
              🛏 {room.name} — {room.base_price?.toLocaleString("vi-VN")} đ/đêm
            </p>
          )}
        </div>
      )}

      <p className="success-note">
        Chúng tôi sẽ gửi xác nhận qua email cho bạn sớm nhất!
      </p>

      <button className="success-btn" onClick={() => navigate("/")}>
        VỀ TRANG CHỦ
      </button>

    </div>
  );
};

export default BookingSuccess;