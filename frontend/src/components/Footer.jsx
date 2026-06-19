import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* CỘT 1: HỖ TRỢ */}
        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <ul>
            <li>
              <span>Hướng dẫn đặt phòng</span>
            </li>
            <li>
              <span>Chính sách hủy phòng</span>
            </li>{" "}
            {/* ← đổi thành span */}
            <li>
              <span>Khiếu nại & Góp ý</span>
            </li>{" "}
            {/* ← đổi thành span */}
            <li>
              <span>Câu hỏi thường gặp (FAQ)</span>
            </li>{" "}
            {/* ← đổi thành span */}
          </ul>
        </div>
        {/* CỘT 2: KHÁM PHÁ */}
        <div className="footer-col">
          <h4>Khám phá Vũng Tàu và đà lạt </h4>
          <ul>
            <li>
              <span>Về chúng tôi</span>
            </li>
            <li>
              <span>Cẩm nang du lịch</span>
            </li>
            <li>
              <span>Dịch vụ đi kèm</span>
            </li>
            <li>
              <span>Ưu đãi thành viên</span>
            </li>
          </ul>
        </div>

        {/* CỘT 3: LIÊN HỆ */}
        <div className="footer-col">
          <h4>Liên hệ</h4>
          <p>Hotline: 0325868494</p>
          <p>Địa chỉ: Đức Châu-Thạc Châu</p>
          <p>Email: nguyenducdang14012005@gmail.com</p>
        </div>

        {/* CỘT 4: SOCIAL */}
        <div className="footer-col">
          <h4>Social</h4>
          <div className="social-icons">
            <span>
              <i className="fa-brands fa-facebook-f"></i>
            </span>
            <span>
              <i className="fa-brands fa-threads"></i>
            </span>
            <span>
              <i className="fa-brands fa-tiktok"></i>
            </span>
            <span>
              <i className="fa-brands fa-youtube"></i>
            </span>
          </div>
        </div>
      </div>
      s{/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>© Copyright Vung Tau Đà Lạt 2026</p>
      </div>
    </footer>
  );
};

export default Footer;
