const API_BASE = '/api'

async function request(path, opts = {}){
  const token = localStorage.getItem('admin_token')
  const headers = opts.headers || {}
  if (!(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(API_BASE + path, {
    ...opts,
    headers
  })
  if(!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  // Room types
  listRoomTypes: () => request('/room-types'),
  createRoomType: (body) => request('/room-types', { method: 'POST', body: JSON.stringify(body) }),
  updateRoomType: (id, body) => request(`/room-types/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteRoomType: (id) => request(`/room-types/${id}`, { method: 'DELETE' }),

  // Rooms
  listRooms: () => request('/rooms'),
  createRoom: (body) => request('/rooms', { method: 'POST', body: JSON.stringify(body) }),
  updateRoom: (id, body) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteRoom: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),

  // Bookings
  listBookings: () => request('/bookings'),
  updateBookingStatus: (id, body) => request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),

  // Availability & stats
  setMaintenance: (body) => request('/availability', { method: 'POST', body: JSON.stringify(body) }),
  stats: (q) => request(`/stats?from=${q.from}&to=${q.to}`),
  loginAdmin: (username, password) => request('/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  uploadFile: async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    const token = localStorage.getItem('admin_token')
    const res = await fetch('/api/upload', { method: 'POST', body: fd, headers: token?{ Authorization: 'Bearer '+token } : {} })
    if(!res.ok) throw new Error(await res.text())
    return res.json()
  }
}

export default api
