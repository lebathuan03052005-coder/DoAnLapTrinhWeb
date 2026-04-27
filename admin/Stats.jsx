import React, { useState } from 'react'
import { api } from './api'

export default function Stats(){
  const [from,setFrom]=useState('')
  const [to,setTo]=useState('')
  const [res,setRes]=useState(null)

  async function run(){
    if(!from||!to) return alert('Chọn khoảng thời gian')
    try{ const r = await api.stats({ from, to }); setRes(r) }catch(e){ alert(e.message) }
  }

  return (
    <div>
      <h3>Thống kê</h3>
      <label>From</label>
      <input type="date" value={from} onChange={e=> setFrom(e.target.value)} />
      <label>To</label>
      <input type="date" value={to} onChange={e=> setTo(e.target.value)} />
      <div className="form-actions"><button className="btn-add" onClick={run}>Xem</button></div>
      {res && (
        <div style={{marginTop:12}}>
          <div className="cards"><div className="card small">Tổng: <b>{res.totalBookings}</b></div></div>
        </div>
      )}
    </div>
  )
}
