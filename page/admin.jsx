import React, { useEffect, useMemo, useState } from "react";
import "./admin.css";

const STORAGE_KEYS = {
  ROOM_TYPES: "hotel_room_types",
  ROOMS: "hotel_rooms",
  BOOKINGS: "hotel_bookings",
};

const sampleData = () => {
  const rt = [
    {
      id: "rt-1",
      name: "Deluxe",
      price: 120,
      capacity: 2,
      bed: "King",
      amenities: ["Wifi", "View biển"],
      images: [],
      status: "ACTIVE",
    },
  ];
  const rooms = [
    { id: "r-101", number: "101", roomTypeId: "rt-1", status: "ACTIVE" },
  ];
  const bookings = [
    {
      id: "b-1",
      roomId: "r-101",
      guestName: "Nguyễn Văn A",
      phone: "0123456789",
      start: "2026-05-02",
      end: "2026-05-05",
      status: "PENDING",
    },
  ];
  return { rt, rooms, bookings };
};

function useStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

const Admin = () => {
  // Load sample if empty
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEYS.ROOM_TYPES)) {
      const { rt, rooms, bookings } = sampleData();
      localStorage.setItem(STORAGE_KEYS.ROOM_TYPES, JSON.stringify(rt));
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    }
  }, []);

  const [roomTypes, setRoomTypes] = useStorage(STORAGE_KEYS.ROOM_TYPES, []);
  const [rooms, setRooms] = useStorage(STORAGE_KEYS.ROOMS, []);
  const [bookings, setBookings] = useStorage(STORAGE_KEYS.BOOKINGS, []);

  const [view, setView] = useState("room-types");

  /* Room Types CRUD */
  const emptyType = { id: null, name: "", price: "", capacity: "", bed: "", amenities: [], images: [], status: "ACTIVE" };
  const [editingType, setEditingType] = useState(null);

  function validateRoomType(t) {
    if (!t.name || t.name.trim() === "") return "Tên loại phòng không được để trống";
    if (!Number(t.price) || Number(t.price) <= 0) return "Giá phải là số dương";
    if (!Number(t.capacity) || Number(t.capacity) <= 0) return "Sức chứa phải là số dương";
    return null;
  }

  function saveRoomType(t) {
    const err = validateRoomType(t);
    if (err) return alert("Lỗi: " + err);
    if (t.id) {
      setRoomTypes((prev) => prev.map((p) => (p.id === t.id ? { ...t } : p)));
      alert("Sửa thành công");
    } else {
      t.id = "rt-" + Date.now();
      setRoomTypes((prev) => [t, ...prev]);
      alert("Thêm thành công");
    }
    setEditingType(null);
  }

  function softDeleteRoomType(id) {
    // check bookings: if any room of this type has pending or checked-in booking -> block
    const affectedRooms = rooms.filter((r) => r.roomTypeId === id).map((r) => r.id);
    const conflict = bookings.find((b) => affectedRooms.includes(b.roomId) && (b.status === "PENDING" || b.status === "CHECKED_IN"));
    if (conflict) {
      return alert("Lỗi: Có đơn đang chờ hoặc đang ở, không thể xóa loại phòng");
    }
    setRoomTypes((prev) => prev.map((p) => (p.id === id ? { ...p, status: "INACTIVE" } : p)));
    alert("Đã chuyển trạng thái thành INACTIVE (soft delete)");
  }

  /* Rooms CRUD */
  const emptyRoom = { id: null, number: "", roomTypeId: "", status: "ACTIVE" };
  const [editingRoom, setEditingRoom] = useState(null);

  function saveRoom(r) {
    if (!r.number || r.number.trim() === "") return alert("Số phòng không được để trống");
    if (!r.roomTypeId) return alert("Phải chọn loại phòng");
    // unique number
    const dup = rooms.find((x) => x.number === r.number && x.id !== r.id && x.status !== "INACTIVE");
    if (dup) return alert("Số phòng đã tồn tại");
    if (r.id) {
      setRooms((prev) => prev.map((p) => (p.id === r.id ? { ...r } : p)));
      alert("Sửa phòng thành công");
    } else {
      r.id = "r-" + Date.now();
      setRooms((prev) => [r, ...prev]);
      alert("Thêm phòng thành công");
    }
    setEditingRoom(null);
  }

  function softDeleteRoom(id) {
    const conflict = bookings.find((b) => b.roomId === id && (b.status === "PENDING" || b.status === "CHECKED_IN"));
    if (conflict) return alert("Lỗi: Phòng đang có khách, không thể xóa");
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, status: "INACTIVE" } : r)));
    alert("Phòng đã chuyển trạng thái INACTIVE");
  }

  /* Bookings management */
  function changeBookingStatus(bookingId, to) {
    setBookings((prev) => {
      return prev.map((b) => {
        if (b.id !== bookingId) return b;
        // state machine
        const ok = (() => {
          if (b.status === "PENDING" && (to === "CHECKED_IN" || to === "CANCELLED")) return true;
          if (b.status === "CHECKED_IN" && to === "COMPLETED") return true;
          return false;
        })();
        if (!ok) {
          alert("Không cho phép chuyển trạng thái này");
          return b;
        }
        // if cancelling, free dates (we're using bookings list only)
        return { ...b, status: to };
      });
    });
  }

  /* Availability check for a room on a date */
  function isBooked(roomId, date) {
    return bookings.some((b) => b.roomId === roomId && b.status !== "CANCELLED" && !(date < b.start || date > b.end));
  }

  /* Stats */
  function statsBetween(start, end) {
    const s = start;
    const e = end;
    const valid = bookings.filter((b) => (b.status === "CHECKED_IN" || b.status === "COMPLETED") && !(b.end < s || b.start > e));
    const totalBookings = valid.length;
    const perRoom = {};
    valid.forEach((b) => {
      perRoom[b.roomId] = (perRoom[b.roomId] || 0) + 1;
    });
    return { totalBookings, perRoom };
  }

  /* Small UI components inline */
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">ADMIN BOOKING</div>
        <ul className="admin-menu">
          <li onClick={() => setView("room-types")} className={view === "room-types" ? "active" : ""}>Quản lý Loại phòng</li>
          <li onClick={() => setView("rooms")} className={view === "rooms" ? "active" : ""}>Quản lý Phòng</li>
          <li onClick={() => setView("bookings")} className={view === "bookings" ? "active" : ""}>Danh sách Đơn đặt phòng</li>
          <li onClick={() => setView("availability")} className={view === "availability" ? "active" : ""}>Cập nhật Sẵn có</li>
          <li onClick={() => setView("stats")} className={view === "stats" ? "active" : ""}>Thống kê</li>
          <li className="logout">Đăng xuất</li>
        </ul>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h2>Quản lý khách sạn</h2>
          <div className="user-info">Chào, Admin!</div>
        </header>

        <section className="admin-main">
          <div className="card">
            {view === "room-types" && (
              <div>
                <h3>Loại phòng</h3>
                <button className="btn-add" onClick={() => setEditingType({ ...emptyType })}>+ Thêm loại phòng</button>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Tên</th>
                        <th>Giá/đêm</th>
                        <th>Sức chứa</th>
                        <th>Giường</th>
                        <th>Tiện ích</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomTypes.map((t) => (
                        <tr key={t.id} className={t.status === "INACTIVE" ? "muted" : ""}>
                          <td>{t.name}</td>
                          <td>{t.price}</td>
                          <td>{t.capacity}</td>
                          <td>{t.bed}</td>
                          <td>{(t.amenities || []).join(", ")}</td>
                          <td>{t.status}</td>
                          <td>
                            <button onClick={() => setEditingType({ ...t })}>Sửa</button>
                            <button onClick={() => softDeleteRoomType(t.id)}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {editingType && (
                  <div className="form-panel">
                    <h4>{editingType.id ? "Sửa loại phòng" : "Thêm loại phòng"}</h4>
                    <label>Tên</label>
                    <input value={editingType.name} onChange={(e) => setEditingType({ ...editingType, name: e.target.value })} />
                    <label>Giá/đêm</label>
                    <input type="number" value={editingType.price} onChange={(e) => setEditingType({ ...editingType, price: e.target.value })} />
                    <label>Sức chứa</label>
                    <input type="number" value={editingType.capacity} onChange={(e) => setEditingType({ ...editingType, capacity: e.target.value })} />
                    <label>Loại giường</label>
                    <input value={editingType.bed} onChange={(e) => setEditingType({ ...editingType, bed: e.target.value })} />
                    <label>Tiện ích (phân cách bằng dấu phẩy)</label>
                    <input value={(editingType.amenities || []).join(", ")} onChange={(e) => setEditingType({ ...editingType, amenities: e.target.value.split(",").map(s=>s.trim()).filter(Boolean) })} />
                    <div className="form-actions">
                      <button onClick={() => saveRoomType(editingType)} className="btn-add">Lưu</button>
                      <button onClick={() => setEditingType(null)}>Hủy</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {view === "rooms" && (
              <div>
                <h3>Phòng</h3>
                <button className="btn-add" onClick={() => setEditingRoom({ ...emptyRoom })}>+ Thêm phòng</button>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Số phòng</th>
                        <th>Loại phòng</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((r) => (
                        <tr key={r.id} className={r.status === "INACTIVE" ? "muted" : ""}>
                          <td>{r.number}</td>
                          <td>{(roomTypes.find((t) => t.id === r.roomTypeId) || {}).name}</td>
                          <td>{r.status}</td>
                          <td>
                            <button onClick={() => setEditingRoom({ ...r })}>Sửa</button>
                            <button onClick={() => softDeleteRoom(r.id)}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {editingRoom && (
                  <div className="form-panel">
                    <h4>{editingRoom.id ? "Sửa phòng" : "Thêm phòng"}</h4>
                    <label>Số phòng</label>
                    <input value={editingRoom.number} onChange={(e) => setEditingRoom({ ...editingRoom, number: e.target.value })} />
                    <label>Loại phòng</label>
                    <select value={editingRoom.roomTypeId} onChange={(e) => setEditingRoom({ ...editingRoom, roomTypeId: e.target.value })}>
                      <option value="">-- Chọn --</option>
                      {roomTypes.filter(t=>t.status!=='INACTIVE').map((t)=> <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <div className="form-actions">
                      <button onClick={() => saveRoom(editingRoom)} className="btn-add">Lưu</button>
                      <button onClick={() => setEditingRoom(null)}>Hủy</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {view === "bookings" && (
              <div>
                <h3>Danh sách Đơn đặt phòng</h3>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Mã</th>
                        <th>Phòng</th>
                        <th>Khách</th>
                        <th>SDT</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.sort((a,b)=> b.id.localeCompare(a.id)).map((b) => (
                        <tr key={b.id}>
                          <td>{b.id}</td>
                          <td>{(rooms.find(r=>r.id===b.roomId)||{}).number}</td>
                          <td>{b.guestName}</td>
                          <td>{b.phone}</td>
                          <td>{b.start} → {b.end}</td>
                          <td><span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                          <td>
                            {b.status === "PENDING" && <button onClick={()=> changeBookingStatus(b.id, "CHECKED_IN")}>Nhận phòng</button>}
                            {b.status === "PENDING" && <button onClick={()=> changeBookingStatus(b.id, "CANCELLED")}>Hủy</button>}
                            {b.status === "CHECKED_IN" && <button onClick={()=> changeBookingStatus(b.id, "COMPLETED")}>Hoàn thành</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {view === "availability" && (
              <div>
                <h3>Cập nhật trạng thái sẵn có</h3>
                <AvailabilityPanel rooms={rooms} bookings={bookings} setBookings={setBookings} />
              </div>
            )}

            {view === "stats" && (
              <div>
                <h3>Thống kê</h3>
                <StatsPanel rooms={rooms} roomTypes={roomTypes} bookings={bookings} statsBetween={statsBetween} />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

function AvailabilityPanel({ rooms, bookings, setBookings }) {
  const [roomId, setRoomId] = useState(rooms[0] ? rooms[0].id : "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("MAINTENANCE");

  function checkConflict(roomId, fromD, toD) {
    return bookings.some((b) => b.roomId === roomId && b.status !== "CANCELLED" && !(toD < b.start || fromD > b.end));
  }

  function applyLock() {
    if (!roomId || !from || !to) return alert("Chọn phòng và ngày");
    if (from > to) return alert("Khoảng thời gian không hợp lệ");
    if (checkConflict(roomId, from, to)) return alert("Có booking trùng, không thể khóa");
    // Create maintenance booking-like entry with status MAINTENANCE
    const id = "m-" + Date.now();
    setBookings((prev)=> [{ id, roomId, guestName: "MAINTENANCE", phone: "", start: from, end: to, status: status }, ...prev]);
    alert("Cập nhật trạng thái thành công");
  }

  return (
    <div>
      <label>Chọn phòng</label>
      <select value={roomId} onChange={(e)=> setRoomId(e.target.value)}>
        <option value="">-- Chọn --</option>
        {rooms.filter(r=>r.status!=='INACTIVE').map(r=> <option key={r.id} value={r.id}>{r.number}</option>)}
      </select>
      <label>Từ</label>
      <input type="date" value={from} onChange={(e)=> setFrom(e.target.value)} />
      <label>Đến</label>
      <input type="date" value={to} onChange={(e)=> setTo(e.target.value)} />
      <label>Trạng thái</label>
      <select value={status} onChange={(e)=> setStatus(e.target.value)}>
        <option value="MAINTENANCE">Đang bảo trì</option>
        <option value="BLOCKED">Khóa tạm thời</option>
      </select>
      <div className="form-actions">
        <button className="btn-add" onClick={applyLock}>Áp dụng</button>
      </div>

      <div style={{marginTop:16}}>
        <h4>Hiện trạng booking/maintenance</h4>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Phòng</th><th>Mã</th><th>Start</th><th>End</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {bookings.map(b=> (<tr key={b.id}><td>{(rooms.find(r=>r.id===b.roomId)||{}).number}</td><td>{b.id}</td><td>{b.start}</td><td>{b.end}</td><td>{b.status}</td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatsPanel({ rooms, roomTypes, bookings, statsBetween }){
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState(null);

  function run() {
    if (!from || !to) return alert("Chọn khoảng thời gian");
    if (from > to) return alert("Khoảng không hợp lệ");
    const res = statsBetween(from, to);
    setResult(res);
  }

  return (
    <div>
      <label>Ngày bắt đầu</label>
      <input type="date" value={from} onChange={(e)=> setFrom(e.target.value)} />
      <label>Ngày kết thúc</label>
      <input type="date" value={to} onChange={(e)=> setTo(e.target.value)} />
      <div className="form-actions"><button className="btn-add" onClick={run}>Xem thống kê</button></div>

      {result && (
        <div style={{marginTop:16}}>
          <div className="cards">
            <div className="card small">Tổng lượt đặt thành công: <b>{result.totalBookings}</b></div>
            <div className="card small">Tổng số phòng: <b>{rooms.length}</b></div>
          </div>
          <div className="table-wrap" style={{marginTop:12}}>
            <table>
              <thead><tr><th>Phòng</th><th>Loại</th><th>Lượt sử dụng</th><th>Trạng thái hiện tại</th></tr></thead>
              <tbody>
                {rooms.map(r=> (
                  <tr key={r.id}><td>{r.number}</td><td>{(roomTypes.find(t=>t.id===r.roomTypeId)||{}).name}</td><td>{result.perRoom[r.id]||0}</td><td>{r.status}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
