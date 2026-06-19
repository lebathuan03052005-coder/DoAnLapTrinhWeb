import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./booking.css";
import qrImage from "../assets/qr-payment.png";

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, room, checkIn, checkOut, guests } = location.state || {};

  // State form
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [showQR, setShowQR] = useState(false);
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dateStr);
  };

  const nights = (() => {
    const inDate = parseDate(checkIn);
    const outDate = parseDate(checkOut);
    if (!inDate || !outDate) return 1;
    const diff = Math.abs(outDate - inDate);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  })();

  const totalAmount = room?.base_price * nights;
  const handlePaymentConfirm = async () => {
    // Kiểm tra thông tin
    if (!guestName || !guestPhone || !guestEmail) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotel_id: hotel.id,
          guest_name: guestName,
          guest_phone: guestPhone,
          guest_email: guestEmail,
          room_type_id: room.id,
          check_in_date: checkIn,
          check_out_date: checkOut,
          total_amount: totalAmount,
          quantity: 1
        })
      });

      const data = await res.json();

      if (data.success) {
        setShowQR(false);
        navigate('/booking-success', {
          state: { hotel, room, checkIn, checkOut, guests, totalAmount }
        });
      } else {
        alert("Lỗi đặt phòng, vui lòng thử lại!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  if (!hotel || !room) {
    return <h2 style={{ textAlign: "center" }}>Vui lòng quay lại chọn phòng</h2>;
  }return (
    <div className="form-container">
      <div className="main-layout">

        {/* LEFT - FORM */}
        <div className="form-wrapper">
          <h2 className="form-title">Điền thông tin liên hệ</h2>
          <div className="form-card">

            <div className="form-group">
              <label>Họ và tên *</label>
              <input 
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="row">
              <div className="col">
                <label>Email *</label>
                <input 
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Nhập email"
                />
              </div>
              <div className="col">
                <label>Số điện thoại *</label>
                <input 
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <textarea 
              placeholder="Yêu cầu đặc biệt..."
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
            />

            <button 
              className="submit-btn"
              onClick={() => {
                if (!guestName || !guestPhone || !guestEmail) {
                  alert("Vui lòng điền đầy đủ thông tin!");
                  return;
                }
                setShowQR(true);
              }}
            >
              THANH TOÁN QR 📱
            </button>

          </div>
        </div>

        {/* RIGHT - THÔNG TIN ĐẶT PHÒNG */}
        <div className="right-col">
          <h2 className="form-title">Thông tin đặt phòng</h2>
          <div className="summary-card">

            <div className="sum-header">
              <img src={`http://localhost:5000${hotel.image}`} alt={hotel.name} />
              <div>
                <h4>{hotel.name}</h4>
                <p>{hotel.address}</p>
              </div>
            </div>

            <div className="sum-body">
              <div className="sum-row">
                <span className="sum-label">Kiểu phòng</span>
                <span className="sum-value">{room.name}</span>
              </div>
              <div className="sum-row">
                <span className="sum-label">Giá</span>
                <span className="sum-value">{room.base_price?.toLocaleString("vi-VN")} đ/đêm</span>
              </div>
              <div className="sum-row">
                <span className="sum-label">Ngày nhận phòng</span>
                <span className="sum-value">{checkIn}</span>
              </div>
              <div className="sum-row">
                <span className="sum-label">Ngày trả phòng</span>
                <span className="sum-value">{checkOut}</span>
              </div>
              <div className="sum-row">
                <span className="sum-label">Số khách</span>
                <span className="sum-value">{guests}</span>
              </div>
              <div className="sum-row" style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '8px' }}>
                <span className="sum-label">Số đêm</span>
                <span className="sum-value">{nights} đêm</span>
              </div>
              <div className="sum-row">
                <span className="sum-label">Tổng tiền</span>
                <span className="sum-value" style={{ color: '#ef5b25', fontWeight: 'bold', fontSize: '18px' }}>
                  {totalAmount?.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* POPUP QR */}
      {showQR && (
        <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            textAlign: 'center',
            maxWidth: '380px',
            width: '90%'
          }}>
            <h3 style={{ color: '#003580', marginBottom: '8px' }}>
              Quét mã QR để thanh toán
            </h3>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '4px' }}>
              📅 {checkIn} → {checkOut} ({nights} đêm)
            </p>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>
              {room.base_price?.toLocaleString('vi-VN')} đ x {nights} đêm = {' '}
              <strong style={{ color: '#ef5b25', fontSize: '18px' }}>
                {totalAmount?.toLocaleString('vi-VN')} đ
              </strong>
            </p>

            <img 
              src={qrImage}
              alt="QR thanh toán"
              style={{ width: '220px', height: '220px', objectFit: 'contain', marginBottom: '16px' }}
            />

            <p style={{ color: '#555', fontSize: '13px', marginBottom: '20px' }}>
              Sau khi thanh toán, bấm xác nhận bên dưới
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowQR(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  color: '#555'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handlePaymentConfirm}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#ef5b25',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Đã thanh toán ✓
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingForm;
    
