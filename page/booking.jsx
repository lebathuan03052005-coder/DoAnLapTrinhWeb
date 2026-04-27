import React from "react";
import { useLocation } from "react-router-dom";
import "./booking.css";

const BookingForm = () => {

  const location = useLocation();

  const { hotel, checkIn, checkOut, guests } = location.state || {};

  if (!hotel) {
    return <h2 style={{ textAlign: "center" }}>Vui lòng quay lại chọn phòng</h2>;
  }

  return (
    <div className="form-container">
      <div className="main-layout">

        {/* LEFT */}
        <div className="form-wrapper">
          <h2 className="form-title">Điền thông tin liên hệ</h2>

          <div className="form-card">
            <div className="form-group">
              <label>Họ và tên *</label>
              <input type="text" />
            </div>

            <div className="row">
              <div className="col">
                <label>Email *</label>
                <input type="email" />
              </div>
              <div className="col">
                <label>Số điện thoại *</label>
                <input type="tel" />
              </div>
            </div>

            <textarea placeholder="Yêu cầu đặc biệt..." />

            <button 
              className="submit-btn"
              onClick={() => alert("Đặt phòng thành công!")}
            >
              TIẾP TỤC
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-col">
          <h2 className="form-title">Thông tin đặt phòng</h2>

          <div className="summary-card">

            <div className="sum-header">
              <img src={hotel.mainImage} alt="" />
              <div>
                <h4>{hotel.name}</h4>
                <p>{hotel.address}</p>
              </div>
            </div>

            <div className="sum-body">

              <div className="sum-row">
                <span className="sum-label">Giá</span>
                <span className="sum-value">{hotel.newPrice}</span>
              </div>

              <div className="sum-row">
                <span className="sum-label">Ngày nhận phòng</span>
                <span className="sum-value">{checkIn || "24/04/2026"}</span>
              </div>

              <div className="sum-row">
                <span className="sum-label">Ngày trả phòng</span>
                <span className="sum-value">{checkOut || "25/04/2026"}</span>
              </div>

              <div className="sum-row">
                <span className="sum-label">Số khách</span>
                <span className="sum-value">{guests || "2 khách, 1 phòng"}</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingForm;