import { useState, useEffect } from 'react'
import './HotelManagement.css'

// ✅ FIX 1: Dùng một hằng duy nhất, URL khớp với route trong admin.js
const API_BASE = "http://localhost:5000/api/admin";

const fmt = n => new Intl.NumberFormat('vi-VN').format(n) + ' đ'

const ROOM_STATUS = {
  available:   { label: 'Trống',         cls: 'hm-badge-green'  },
  occupied:    { label: 'Đang có khách', cls: 'hm-badge-red'    },
  maintenance: { label: 'Bảo trì',       cls: 'hm-badge-gray'   },
}

const STATUS_LABELS = {
  pending:    { label: 'Chờ xác nhận', cls: 'hm-badge-yellow' },
  confirmed:  { label: 'Đã xác nhận',  cls: 'hm-badge-blue'   },
  checked_in: { label: 'Đang lưu trú', cls: 'hm-badge-red'    },
  completed:  { label: 'Hoàn thành',   cls: 'hm-badge-green'  },
  cancelled:  { label: 'Đã hủy',       cls: 'hm-badge-gray'   },
}

const ALLOWED_TRANSITIONS = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['checked_in', 'cancelled'],
  checked_in: ['completed'],
  completed:  [],
  cancelled:  [],
}

const STATUS_NEXT = {
  pending:    { to: 'confirmed',  label: '✓ Xác nhận' },
  confirmed:  { to: 'checked_in', label: '🔑 Nhận phòng' },
  checked_in: { to: 'completed',  label: '✅ Hoàn thành' },
}

const AMENITIES_LIST = ['Wifi','Bồn tắm','View biển','Minibar','Ban công','Bếp nhỏ','Máy sấy','Két an toàn']
const BED_TYPES = ['Single','Twin','Double','King','King + Sofa']
const AV_CLASSES = ['hm-avatar-indigo','hm-avatar-green','hm-avatar-amber','hm-avatar-rose','hm-avatar-cyan']

function Badge({ status, map }) {
  const s = map[status] || { label: status, cls: 'hm-badge-gray' }
  return (
    <span className={`hm-badge ${s.cls}`}>
      <span className="hm-badge-dot" />
      {s.label}
    </span>
  )
}

function Btn({ variant = 'secondary', size, onClick, disabled, children, title }) {
  const cls = {
    primary:   'hm-btn hm-btn-primary',
    secondary: 'hm-btn',
    success:   'hm-btn hm-btn-success',
    danger:    'hm-btn hm-btn-danger',
    ghost:     'hm-btn hm-btn-ghost',
  }[variant]
  return (
    <button className={`${cls}${size === 'sm' ? ' hm-btn-sm' : ''}`} onClick={onClick} disabled={disabled} title={title}>
      {children}
    </button>
  )
}

function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const sizeCls = { sm: 'hm-modal-sm', md: 'hm-modal-md', lg: 'hm-modal-lg' }[size]
  return (
    <div className="hm-overlay">
      <div className={`hm-modal ${sizeCls}`}>
        <div className="hm-modal-head">
          <h3>{title}</h3>
          <button className="hm-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="hm-modal-body">{children}</div>
      </div>
    </div>
  )
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="hm-overlay">
      <div className="hm-modal hm-modal-sm">
        <div className="hm-confirm-body">
          <p className="hm-confirm-title">{title}</p>
          <p className="hm-confirm-msg">{message}</p>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
            <Btn variant="secondary" onClick={onCancel}>Huỷ</Btn>
            <Btn variant="danger" onClick={onConfirm}>Xoá</Btn>
          </div>
        </div>
      </div>
    </div>
  )
}

function Toast({ message, type = 'success', onClose }) {
  return (
    <div className={`hm-toast hm-toast-${type}`}>
      <span>{message}</span>
      <button className="hm-toast-close" onClick={onClose}>✕</button>
    </div>
  )
}

function Avatar({ name }) {
  const initials = name ? name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() : '??'
  const cls = name ? AV_CLASSES[name.charCodeAt(0) % AV_CLASSES.length] : AV_CLASSES[0]
  return <div className={`hm-avatar ${cls}`}>{initials}</div>
}

function StatCard({ icon, label, value }) {
  return (
    <div className="hm-stat-card">
      <div className="hm-stat-label"><span>{icon}</span>{label}</div>
      <div className="hm-stat-value">{value}</div>
    </div>
  )
}

/* ── Tab 1: Rooms ── */
// ✅ FIX 2: RoomsTab nhận đúng props từ parent (types, rooms, refreshData)
//           Xoá loadData nội bộ dùng axios (chưa import), xoá hàm saveRoom trùng lặp
//           Thống nhất field name: number/typeId khớp với server (admin.js)
function RoomsTab({ showToast, types, rooms, refreshData }) {
  const [typeModal, setTypeModal] = useState(false)
  const [roomModal, setRoomModal] = useState(false)
  const [editingType, setEditingType] = useState(null)
  const [confirm, setConfirm] = useState(null)

  // ✅ FIX 5: field name thống nhất: name/price/capacity/bedType/amenities
  //           khớp với body mà admin.js đọc qua req.body
  const emptyTypeForm = { name:'', price:'', capacity:'', bedType:'', amenities:[] }
  const [typeForm, setTypeForm] = useState(emptyTypeForm)

  const emptyRoomForm = { number:'', typeId:'' }
  const [roomForm, setRoomForm] = useState(emptyRoomForm)

  function openAddType() { setEditingType(null); setTypeForm(emptyTypeForm); setTypeModal(true) }
  function openEditType(t) {
    setEditingType(t)
    // Map từ field DB (base_price, bed_type) sang field form (price, bedType)
    setTypeForm({
      id: t.id,
      name: t.name,
      price: t.price,
      capacity: t.capacity,
      bedType: t.bedType,
      amenities: t.amenities || []
    })
    setTypeModal(true)
  }

  async function saveType() {
    if (!typeForm.name || !typeForm.price || !typeForm.capacity) {
      showToast('Vui lòng nhập đủ tên, giá và sức chứa', 'error')
      return
    }
    try {
      // ✅ FIX 1: dùng API_BASE = "/api/admin" → POST /api/admin/room-types (đúng route admin.js)
      const res = await fetch(`${API_BASE}/room-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(typeForm)
      })
      if (!res.ok) throw new Error()
      showToast(editingType ? 'Đã cập nhật loại phòng' : 'Đã thêm loại phòng mới')
      setTypeModal(false)
      refreshData()
    } catch {
      showToast('Không thể lưu loại phòng', 'error')
    }
  }

  // ✅ FIX 3: Chỉ còn 1 hàm saveRoom duy nhất, dùng field number/typeId khớp server
  async function saveRoom() {
    if (!roomForm.number || !roomForm.typeId) {
      showToast('Vui lòng nhập số phòng và chọn loại phòng', 'error')
      return
    }
    try {
      // ✅ FIX 1: POST /api/admin/rooms (đúng route admin.js)
      const res = await fetch(`${API_BASE}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: roomForm.number, typeId: parseInt(roomForm.typeId) })
      })
      if (!res.ok) throw new Error()
      showToast('Đã thêm phòng mới')
      setRoomModal(false)
      setRoomForm(emptyRoomForm)
      refreshData()
    } catch {
      showToast('Không thể thêm phòng', 'error')
    }
  }

  async function deleteType(id) {
    if (rooms.some(r => r.typeId === id)) {
      showToast('Loại phòng này đang chứa phòng thực tế, không thể xoá!', 'error')
      setConfirm(null)
      return
    }
    try {
      const res = await fetch(`${API_BASE}/room-types/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Lỗi ràng buộc dữ liệu!')
      showToast('Xóa thành công')
      setConfirm(null)
      refreshData()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  async function deleteRoom(room) {
    if (room.status === 'occupied') { showToast('Phòng đang có khách!', 'error'); setConfirm(null); return }
    try {
      const res = await fetch(`${API_BASE}/rooms/${room.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Lỗi Server')
      showToast('Đã xóa phòng thành công')
      setConfirm(null)
      refreshData()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div>
      <div className="hm-section-header">
        <div>
          <div className="hm-section-title">Phòng &amp; loại phòng</div>
          <div className="hm-section-sub">{types.length} loại · {rooms.length} phòng</div>
        </div>
        <div className="hm-actions">
          <Btn onClick={openAddType}>＋ Thêm loại phòng</Btn>
          <Btn variant="primary" onClick={() => setRoomModal(true)}>＋ Thêm phòng</Btn>
        </div>
      </div>

      <div className="hm-panel hm-space">
        <div className="hm-panel-header"><div className="hm-panel-title">🏷️ Loại phòng</div></div>
        <div className="hm-table-wrap">
          <table className="hm-table">
            <thead>
              <tr><th>Tên loại</th><th>Giá niêm yết</th><th>Sức chứa</th><th>Giường</th><th>Tiện ích</th><th></th></tr>
            </thead>
            <tbody>
              {types.map(t => (
                <tr key={t.id}>
                  <td className="hm-td-bold">{t.name}</td>
                  {/* ✅ FIX 5: server trả về field 'price' (đã alias trong query admin.js) */}
                  <td className="hm-td-price">{fmt(t.price)}</td>
                  <td>{t.capacity} người</td>
                  <td>{t.bedType || '—'}</td>
                  <td>
                    <div className="hm-pills">
                      {(t.amenities || []).map(a => <span key={a} className="hm-pill">{a}</span>)}
                    </div>
                  </td>
                  <td>
                    <Btn variant="ghost" size="sm" onClick={() => openEditType(t)}>✏️</Btn>
                    <Btn variant="danger" size="sm" onClick={() => setConfirm({type:'type',data:t})}>🗑️</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="hm-panel">
        <div className="hm-panel-header"><div className="hm-panel-title">🚪 Phòng vật lý</div></div>
        <div className="hm-table-wrap">
          <table className="hm-table">
            <thead>
              <tr><th>Số phòng</th><th>Loại phòng</th><th>Trạng thái</th><th></th></tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r.id}>
                  {/* ✅ FIX 5: server trả về field 'number' (alias room_number) */}
                  <td className="hm-td-bold">{r.number}</td>
                  <td>{r.typeName || '—'}</td>
                  <td><Badge status={r.status} map={ROOM_STATUS} /></td>
                  <td>
                    <Btn variant="danger" size="sm" disabled={r.status === 'occupied'} onClick={() => setConfirm({type:'room',data:r})}>🗑️</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={typeModal} onClose={() => setTypeModal(false)} title={editingType ? 'Sửa loại phòng' : 'Thêm loại phòng'} size="lg">
        <div className="hm-form-grid">
          <div className="hm-form-group">
            <label className="hm-label">Tên loại phòng <span className="req">*</span></label>
            <input className="hm-input" value={typeForm.name} onChange={e => setTypeForm(p => ({...p, name: e.target.value}))} />
          </div>
          <div className="hm-form-group">
            <label className="hm-label">Giá (VNĐ) <span className="req">*</span></label>
            {/* ✅ FIX 5: bind vào 'price' (không phải 'base_price') */}
            <input className="hm-input" type="number" value={typeForm.price} onChange={e => setTypeForm(p => ({...p, price: e.target.value}))} />
          </div>
          <div className="hm-form-group">
            <label className="hm-label">Sức chứa <span className="req">*</span></label>
            <input className="hm-input" type="number" value={typeForm.capacity} onChange={e => setTypeForm(p => ({...p, capacity: e.target.value}))} />
          </div>
          <div className="hm-form-group">
            <label className="hm-label">Loại giường</label>
            {/* ✅ FIX 5: bind vào 'bedType' (không phải 'bed_type') */}
            <select className="hm-select" value={typeForm.bedType} onChange={e => setTypeForm(p => ({...p, bedType: e.target.value}))}>
              <option value="">-- Chọn --</option>
              {BED_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div className="hm-form-group">
          <label className="hm-label">Tiện ích</label>
          <div className="hm-checkbox-grid">
            {AMENITIES_LIST.map(a => (
              <label key={a} className="hm-checkbox-label">
                <input
                  type="checkbox"
                  checked={(typeForm.amenities || []).includes(a)}
                  onChange={e => setTypeForm(p => ({
                    ...p,
                    amenities: e.target.checked
                      ? [...(p.amenities || []), a]
                      : (p.amenities || []).filter(x => x !== a)
                  }))}
                />
                {a}
              </label>
            ))}
          </div>
        </div>
        <div className="hm-modal-footer">
          <Btn variant="secondary" onClick={() => setTypeModal(false)}>Huỷ</Btn>
          <Btn variant="primary" onClick={saveType}>Lưu</Btn>
        </div>
      </Modal>

      <Modal open={roomModal} onClose={() => setRoomModal(false)} title="Thêm phòng">
        <div className="hm-form-group">
          <label className="hm-label">Số phòng <span className="req">*</span></label>
          {/* ✅ FIX 3: bind vào 'number' (khớp với emptyRoomForm và body gửi lên server) */}
          <input className="hm-input" value={roomForm.number} onChange={e => setRoomForm(p => ({...p, number: e.target.value}))} />
        </div>
        <div className="hm-form-group">
          <label className="hm-label">Phân loại <span className="req">*</span></label>
          {/* ✅ FIX 3: bind vào 'typeId' */}
          <select className="hm-select" value={roomForm.typeId} onChange={e => setRoomForm(p => ({...p, typeId: e.target.value}))}>
            <option value="">-- Chọn --</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="hm-modal-footer">
          <Btn variant="secondary" onClick={() => setRoomModal(false)}>Huỷ</Btn>
          <Btn variant="primary" onClick={saveRoom}>Tạo phòng</Btn>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        title="Xác nhận xoá"
        message={confirm?.type === 'type' ? `Xoá loại "${confirm?.data?.name}"?` : `Xoá phòng ${confirm?.data?.number}?`}
        onConfirm={() => confirm?.type === 'type' ? deleteType(confirm.data.id) : deleteRoom(confirm.data)}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}

/* ── TAB 2 ── */
function CalendarTab({ showToast, rooms }) {
  const daysCount = 20;
  const days = Array.from({length: daysCount}, (_,i) => i+1)
  const today = new Date().getDate()
  const [patterns, setPatterns] = useState([])

  useEffect(() => {
    setPatterns(rooms.map(r => Array(daysCount).fill(r.status === 'maintenance' ? 2 : (r.status === 'occupied' ? 1 : 0))));
  }, [rooms]);

  return (
    <div>
      <div className="hm-section-header">
        <div className="hm-section-title">Sơ đồ phòng tổng quan (20 Ngày)</div>
      </div>
      <div className="hm-panel">
        <div className="hm-calendar-grid">
          <div className="hm-cal-header">
            {days.map(d => <div key={d} className={`hm-cal-day-label${d===today?' today-col':''}`}>{d}</div>)}
          </div>
          <div className="hm-cal-rows">
            {rooms.map((room, ri) => (
              <div key={room.id} className="hm-cal-row">
                <div className="hm-cal-room-label">P. {room.number}</div>
                {days.map((d, di) => {
                  const v = patterns[ri] ? patterns[ri][di] : 0
                  return (
                    <div key={d} className={`hm-cal-cell ${v === 1 ? 'occupied' : v === 2 ? 'maintenance' : 'available'}${d===today?' today-ring':''}`} />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── TAB 3 ── */
// ✅ FIX 4: BookingsTab nhận đúng props bookings và refreshData từ parent
function BookingsTab({ showToast, bookings, refreshData }) {
  const [search, setSearch] = useState('')
  // ✅ FIX 4: filterStatus là state nội bộ (trước đây dùng biến undefined)
  const [filterStatus, setFilterStatus] = useState('all')

  async function updateStatus(id, newStatus) {
    try {
      // ✅ FIX 1: PUT /api/admin/bookings/:id/status (đúng route admin.js)
      const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error('Thao tác thất bại')
      showToast('Đã lưu trạng thái mới')
      refreshData()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const filtered = bookings
    .filter(b => filterStatus === 'all' || b.status === filterStatus)
    .filter(b => !search || b.guestName?.toLowerCase().includes(search.toLowerCase()) || b.phone?.includes(search))

  return (
    <div>
      <div className="hm-filter-row">
        <input className="hm-input hm-search" placeholder="Tìm tên khách, số điện thoại..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="hm-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Tất cả</option>
          {Object.entries(STATUS_LABELS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="hm-panel">
        <div className="hm-table-wrap">
          <table className="hm-table">
            <thead>
              <tr><th>Mã đơn</th><th>Khách hàng</th><th>Loại phòng</th><th>Check-in</th><th>Check-out</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const next = STATUS_NEXT[b.status]
                return (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    {/* ✅ FIX 4: dùng field alias từ server: guestName, phone */}
                    <td>{b.guestName} ({b.phone})</td>
                    <td>{b.roomType}</td>
                    <td>{b.checkIn ? new Date(b.checkIn).toLocaleDateString('vi-VN') : '—'}</td>
                    <td>{b.checkOut ? new Date(b.checkOut).toLocaleDateString('vi-VN') : '—'}</td>
                    <td><span className="hm-td-price">{fmt(b.total)}</span></td>
                    <td><Badge status={b.status} map={STATUS_LABELS} /></td>
                    <td>
                      {next && <Btn variant="success" size="sm" onClick={() => updateStatus(b.id, next.to)}>{next.label}</Btn>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ── TAB 4 ── */
function StatsTab({ bookings }) {
  const revenue = bookings.filter(b => ['completed','checked_in'].includes(b.status)).reduce((a, c) => a + Number(c.total), 0)
  return (
    <div className="hm-stat-grid">
      <StatCard icon="📋" label="Tổng số lượt đặt phòng" value={`${bookings.length} đơn`} />
      <StatCard icon="💰" label="Tổng doanh thu thực tế" value={fmt(revenue)} />
    </div>
  )
}

/* ── MAIN COMPONENT ── */
const TABS = [
  { key:'rooms',    label:'Phòng & loại phòng', icon:'🚪' },
  { key:'calendar', label:'Lịch sẵn có',         icon:'📅' },
  { key:'bookings', label:'Đặt phòng',           icon:'📋' },
  { key:'stats',    label:'Thống kê',            icon:'📊' },
]

export default function HotelManagement() {
  const [tab, setTab] = useState('rooms')
  const [toast, setToast] = useState(null)
  const [roomTypes, setRoomTypes] = useState([])
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  function showToast(msg, type='success') {
    setToast({msg, type})
    setTimeout(() => setToast(null), 3000)
  }

  // ✅ FIX 1: Tất cả URL dùng API_BASE = "/api/admin" → khớp đúng với route trong admin.js
  async function fetchAllData() {
    try {
      setLoading(true)
      const [resTypes, resRooms, resBookings] = await Promise.all([
        fetch(`${API_BASE}/room-types`),
        fetch(`${API_BASE}/rooms`),
        fetch(`${API_BASE}/bookings`),
      ])
      if (!resTypes.ok || !resRooms.ok || !resBookings.ok) throw new Error()
      setRoomTypes(await resTypes.json())
      setRooms(await resRooms.json())
      setBookings(await resBookings.json())
    } catch {
      showToast('Lỗi đồng bộ dữ liệu từ Microsoft SQL Server!', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAllData() }, [])

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}><h3>🔄 Đang đồng bộ SQL Server...</h3></div>

  return (
    <div className="hm-root">
      <div className="hm-container">
        <h1 className="hm-page-title">Quản lý khách sạn</h1>
        <div className="hm-tabs">
          {TABS.map(t => (
            <button key={t.key} className={`hm-tab${tab===t.key?' active':''}`} onClick={() => setTab(t.key)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
        {/* ✅ FIX 2 & 4: truyền đúng props xuống từng tab */}
        {tab === 'rooms'    && <RoomsTab showToast={showToast} types={roomTypes} rooms={rooms} refreshData={fetchAllData} />}
        {tab === 'calendar' && <CalendarTab showToast={showToast} rooms={rooms} />}
        {tab === 'bookings' && <BookingsTab showToast={showToast} bookings={bookings} refreshData={fetchAllData} />}
        {tab === 'stats'    && <StatsTab bookings={bookings} />}
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
