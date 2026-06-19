import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import step2Image from "../assets/hinh_1.png";
import step1Image from "../assets/hinh_2.png";
import step3Image from "../assets/hinh_3.png";
import step4Image from "../assets/hinh_4.png";
import step5Image from "../assets/hinh_5.png";

import "./GuideDetail.css"; 


const guides = [
  {
    id: 1,
    title: "Hướng dẫn đặt phòng khách sạn",
    intro: "Không phải tốn công sức di chuyển xem khách sạn và thanh toán, tham khảo so sánh được nhiều khách sạn một lúc là những tiện ích nổi bật của đặt phòng khách sạn trực tuyến. Với giao diện thân thiện nhất cho người dùng,  luôn mong muốn đem lại trải nghiệm tốt nhất cho khách hàng.",
    sections: [
      {
        title: "Hướng dẫn cách đặt phòng khách sạn  trực tuyến ",
        steps: [
          { step: "Bước 1", content: "chọn địa điểm muốn tìm khách sạn.", image: step1Image  },
          { step: "Bước 2", content: "Chọn ngày check-in, check-out và số lượng khách.", image: step2Image },
          { step: "Bước 3", content: "Bấm TÌM để xem danh sách khách sạn phù hợp.", image: step3Image },
          { step: "Bước 4", content: "Chọn khách sạn và loại phòng mong muốn.", image: step4Image },
          { step: "Bước 5", content: "Điền thông tin liên hệ và xác nhận đặt phòng.", image: step5Image }
        ]
      }
    ]
  },
];
const GuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const guide = guides.find(g => g.id === parseInt(id));

  if (!guide) return <h2 style={{ textAlign: "center", padding: "50px" }}>Không tìm thấy hướng dẫn</h2>;

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
    <div className="guide-container">

      {/* Banner */}
      <div className="guide-banner">
        <img src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80" alt="banner" />
      </div>

      <div>
        <button className="guide-back-btn" onClick={() => navigate(-1)}>
          
        </button>

        <h1 className="guide-title">{guide.title}</h1>
        <p className="guide-intro">{guide.intro}</p>

        {guide.sections.map((section, index) => (
          <div key={index} style={{ marginBottom: "30px" }}>
            <h2 className="guide-section-title">{section.title}</h2>

            {section.intro && (
              <p className="guide-section-intro">{section.intro}</p>
            )}

            {section.steps.map((item, i) => (
              <div key={i} className={`guide-step ${i % 2 !== 0 ? 'reverse' : ''}`}>
                <div className="guide-step-image">
                  <img src={item.image} alt={item.step} />
                </div>
                <div className="guide-step-content">
                  <span className="guide-step-badge">{item.step}</span>
                  <p className="guide-step-text">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideDetail;