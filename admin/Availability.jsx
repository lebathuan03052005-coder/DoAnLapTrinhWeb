import React, { useEffect, useState } from 'react'
import { api } from './api'

export default function Availability(){
  const [rooms, setRooms] = useState([])
  const [roomId, setRoomId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [status, setStatus] = useState('MAINTENANCE')

  useEffect(()=>{ api.listRooms().then(setRooms).catch(()=>setRooms([])) }, [])

  async function apply(){
    if(!roomId||!from||!to) return alert('Chọn phòng và ngày')
    try{ await api.setMaintenance({ roomId, from, to, status }); alert('Áp dụng thành công') }catch(e){ alert(e.message) }
  }

  return (
    <div>
      <h3>Cập nhật sẵn có</h3>
      <label>Phòng</label>
      <select value={roomId} onChange={e=> setRoomId(e.target.value)}>
        <option value="">-- Chọn --</option>
        {rooms.map(r=> <option key={r.id} value={r.id}>{r.number}</option>)}
      </select>
      <label>Từ</label>
      <input type="date" value={from} onChange={e=> setFrom(e.target.value)} />
      <label>Đến</label>
      <input type="date" value={to} onChange={e=> setTo(e.target.value)} />
      <label>Trạng thái</label>
      <select value={status} onChange={e=> setStatus(e.target.value)}>
        <option value="MAINTENANCE">Đang bảo trì</option>
        <option value="BLOCKED">Khóa tạm thời</option>
      </select>
      <div className="form-actions"><button className="btn-add" onClick={apply}>Áp dụng</button></div>
    </div>
  )
}
