const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

/**
 * Cập nhật trạng thái booking (duyệt / hủy).
 * Chỉ thành công nếu user đang đăng nhập (lấy từ localStorage)
 * là chủ (partner_id) của khách sạn chứa booking đó.
 *
 * @param {number|string} bookingId
 * @param {"CONFIRMED" | "CANCELLED" | "PENDING"} status
 */
export const updateBookingStatus = async (bookingId, status) => {
  const userId = localStorage.getItem("customerId"); // đã lưu sẵn lúc login
  if (!userId) {
    alert("Bạn cần đăng nhập để thực hiện thao tác này");
    return { success: false };
  }
  try {
    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, userId }),
      },
    );
    const data = await response.json();
    if (response.ok && data.success) {
      return { success: true };
    } else {
      alert(data.message || "Cập nhật trạng thái thất bại");
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Lỗi kết nối:", error);
    alert("Không kết nối được server");
    return { success: false };
  }
};

// Hàm tiện dùng riêng cho nút Duyệt
export const confirmBooking = (bookingId) =>
  updateBookingStatus(bookingId, "CONFIRMED");

// Hàm tiện dùng riêng cho nút Hủy
export const cancelBooking = (bookingId) =>
  updateBookingStatus(bookingId, "CANCELLED");

/**
 * Lấy toàn bộ danh sách booking (dùng cho trang quản lý).
 * Trả về null nếu lỗi kết nối, [] nếu tải được nhưng rỗng.
 */
export const getAllBookings = async () => {
  try {
    const response = await fetch(`${API_URL}/api/bookings`);
    const data = await response.json();
    return Array.isArray(data.bookings) ? data.bookings : [];
  } catch (error) {
    console.error("Lỗi tải danh sách booking:", error);
    return null;
  }
};
