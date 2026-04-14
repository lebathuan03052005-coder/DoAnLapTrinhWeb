import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng
import "./trang_chu.css";

const HomePage = () => {
  const navigate = useNavigate(); // Khởi tạo điều hướng

  // Dữ liệu mẫu cho phần Gợi ý (Recommend)
  const recommendations = [
    {
      id: 1,
      name: "Vũng Tàu",
      description: "Chỗ nghỉ gần biển cực chill",
      image: "https://vcdn1-dulich.vnecdn.net/2021/05/14/vung-tau-8871-1620984185.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=4GZ89XbJ6-YmR-V7uR2X0A",
      count: "1,234 chỗ nghỉ"
    },
    {
      id: 2,
      name: "Đà Lạt",
      description: "Thành phố sương mù mộng mơ",
      image: "https://Reviewdalat.com/wp-content/uploads/2022/05/canh-dep-da-lat-1.jpg",
      count: "2,567 chỗ nghỉ"
    },
    {
      id: 3,
      name: "Phú Quốc",
      description: "Thiên đường nghỉ dưỡng",
      image: "https://owa.bestprice.vn/images/articles/uploads/top-15-dia-diem-du-lich-phu-quoc-hot-nhat-hien-nay-61247071f0084.jpg",
      count: "890 chỗ nghỉ"
    },
    {
      id: 4,
      name: "Hà Nội",
      description: "Khám phá nét đẹp nghìn năm",
      image: "https://vcdn1-dulich.vnecdn.net/2022/05/11/hanoi-1-1652255105.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=3p8uX5iK3e5jO3E5B1_R_w",
      count: "3,120 chỗ nghỉ"
    }
  ];

  // Hàm xử lý khi nhấn nút TÌM
  const handleSearch = () => {
    // Sau này bạn có thể truyền thêm params tìm kiếm vào đây
    navigate("/admin"); // Ví dụ: tạm thời chuyển sang admin để test
  };

  return (
    <div className="homepage-wrapper">
      {/* Hero Section */}
      <div className="agoda-hero">
        <h1 className="hero-headline">RONG CHƠI BỐN PHƯƠNG, GIÁ VẪN "YÊU THƯƠNG"</h1>
        
        <div className="search-card">
          <div className="main-tabs">
            <div className="tab active"><i className="fa-solid fa-bed"></i> Khách sạn</div>
            <div className="tab"><i className="fa-solid fa-plane"></i> Vé máy bay</div>
            <div className="tab"><i className="fa-solid fa-house"></i> Nhà và Căn hộ</div>
          </div>

          <div className="search-form">
            <div className="input-group full-width">
              <i className="fa-solid fa-magnifying-glass icon"></i>
              <input type="text" defaultValue="Vũng Tàu" placeholder="Nhập điểm đến hoặc tên khách sạn" />
            </div>

            <div className="input-row">
              <div className="input-group half-width">
                <i className="fa-regular fa-calendar icon"></i>
                <div className="text-content">
                  <div className="main-text">22 tháng 4 2026</div>
                  <div className="sub-text">Thứ Tư</div>
                </div>
              </div>
              <div className="input-group half-width">
                <i className="fa-regular fa-calendar icon"></i>
                <div className="text-content">
                  <div className="main-text">25 tháng 4 2026</div>
                  <div className="sub-text">Thứ Bảy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sự kiện onClick cho nút TÌM */}
          <button className="search-btn" onClick={handleSearch}>TÌM</button>
        </div>
      </div>

      {/* Recommend Section */}
      <section className="recommend-container">
        <h2 className="recommend-title">Địa điểm gợi ý cho bạn</h2>
        <p className="recommend-subtitle">Những điểm đến phổ biến nhất tại Việt Nam</p>
        
        <div className="recommend-grid">
          {recommendations.map((item) => (
            <div 
              key={item.id} 
              className="recommend-card"
              onClick={() => navigate("/login")} // Nhấn vào Card sẽ nhảy sang trang Login để test
            >
              <div className="card-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="card-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="count-tag">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;