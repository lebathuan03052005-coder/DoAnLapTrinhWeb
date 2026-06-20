// Ví dụ dùng trong trang quản lý booking (ví dụ BookingDetail.jsx, AdminBookings.jsx...)

import { confirmBooking, cancelBooking } from "./bookingAPI.js";

function BookingActions({ booking, onUpdated }) {
  const handleConfirm = async () => {
    const result = await confirmBooking(booking.id);
    if (result.success) {
      alert("Đã duyệt booking thành công!");
      onUpdated?.(); // gọi lại để reload danh sách/trạng thái UI
    }
  };

  const handleCancel = async () => {
    const result = await cancelBooking(booking.id);
    if (result.success) {
      alert("Đã hủy booking!");
      onUpdated?.();
    }
  };

  if (booking.status !== "PENDING") return null;

  return (
    <div>
      <button onClick={handleConfirm}>Duyệt booking</button>
      <button onClick={handleCancel}>Hủy booking</button>
    </div>
  );
}

export default BookingActions;
