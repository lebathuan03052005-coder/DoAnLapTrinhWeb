import React, { useEffect, useState } from 'react'
import { api } from './api'

export default function Bookings(){
  const [list, setList] = useState([])

  useEffect(()=>{ api.listBookings().then(setList).catch(()=>setList([])) }, [])

  async function changeStatus(id, to){
    try{ await api.updateBookingStatus(id, { status: to }); setList(await api.listBookings()) }catch(e){ alert(e.message) }
  }

  return (
    <div>
      <h3>Danh sách Đơn đặt phòng</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Mã</th><th>Phòng</th><th>Khách</th><th>SDT</th><th>Thời gian</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {list.map(b=> (
              <tr key={b.id}><td>{b.id}</td><td>{b.roomNumber||b.roomId}</td><td>{b.guestName}</td><td>{b.phone}</td><td>{b.start} → {b.end}</td>
                <td><span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                <td>
                  {b.status === 'PENDING' && <button onClick={()=> changeStatus(b.id,'CHECKED_IN')}>Nhận</button>}
                  {b.status === 'PENDING' && <button onClick={()=> changeStatus(b.id,'CANCELLED')}>Hủy</button>}
                  {b.status === 'CHECKED_IN' && <button onClick={()=> changeStatus(b.id,'COMPLETED')}>Hoàn thành</button>}
                </td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
