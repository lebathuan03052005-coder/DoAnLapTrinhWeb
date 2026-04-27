import React from 'react'
import RoomTypes from '../admin/RoomTypes'
import Rooms from '../admin/Rooms'
import Bookings from '../admin/Bookings'
import Availability from '../admin/Availability'
import Stats from '../admin/Stats'
import './admin.css'

import { api } from '../admin/api'

const AdminPanel = () => {
  const [view, setView] = React.useState('room-types')
  const [token, setToken] = React.useState(localStorage.getItem('admin_token'))
  const [loginState, setLoginState] = React.useState({ username: '', password: '' })

  async function login(){
    try{
      const res = await api.loginAdmin(loginState.username, loginState.password)
      const token = res.token
      localStorage.setItem('admin_token', token)
      setToken(token)
    }catch(e){ alert('Login failed: '+ (e.message || e)) }
  }

  function logout(){ localStorage.removeItem('admin_token'); setToken(null) }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">ADMIN BOOKING (New)</div>
        <ul className="admin-menu">
          <li onClick={() => setView('room-types')} className={view==='room-types'? 'active': ''}>Quản lý Loại phòng</li>
          <li onClick={() => setView('rooms')} className={view==='rooms'? 'active': ''}>Quản lý Phòng</li>
          <li onClick={() => setView('bookings')} className={view==='bookings'? 'active': ''}>Đơn đặt phòng</li>
          <li onClick={() => setView('availability')} className={view==='availability'? 'active': ''}>Sẵn có</li>
          <li onClick={() => setView('stats')} className={view==='stats'? 'active': ''}>Thống kê</li>
        </ul>
      </aside>
      <main className="admin-content">
        <header className="admin-header">
          <h2>Quản lý khách sạn (Panel mới)</h2>
          {token && <div style={{marginLeft:12}}><button onClick={logout}>Đăng xuất</button></div>}
        </header>
        <section className="admin-main">
          <div className="card">
            {!token ? (
              <div>
                <h3>Đăng nhập Admin</h3>
                <label>Tên</label>
                <input value={loginState.username} onChange={e=> setLoginState({...loginState, username: e.target.value})} />
                <label>Mật khẩu</label>
                <input type="password" value={loginState.password} onChange={e=> setLoginState({...loginState, password: e.target.value})} />
                <div className="form-actions"><button className="btn-add" onClick={login}>Đăng nhập</button></div>
              </div>
            ) : (
              <div>
                {view === 'room-types' && <RoomTypes />}
                {view === 'rooms' && <Rooms />}
                {view === 'bookings' && <Bookings />}
                {view === 'availability' && <Availability />}
                {view === 'stats' && <Stats />}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminPanel
