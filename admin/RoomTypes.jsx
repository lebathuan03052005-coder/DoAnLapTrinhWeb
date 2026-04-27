import React, { useEffect, useState } from 'react'
import { api } from './api'

export default function RoomTypes(){
  const [list, setList] = useState([])
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(()=>{ api.listRoomTypes().then(setList).catch(()=>setList([])) }, [])

  async function save(t){
    try{
      if(t.id) await api.updateRoomType(t.id, t)
      else await api.createRoomType(t)
      const refreshed = await api.listRoomTypes()
      setList(refreshed)
      setEditing(null)
    }catch(e){ alert('Lỗi: '+e.message) }
  }

  async function remove(id){
    if(!confirm('Xác nhận xóa?')) return
    try{ await api.deleteRoomType(id); setList(await api.listRoomTypes()) }catch(e){ alert(e.message) }
  }

  return (
    <div>
      <h3>Loại phòng</h3>
      <button className="btn-add" onClick={()=> setEditing({name:'',price:0,capacity:1,bed:'',amenities:[],property_type:'hotel',images:[]})}>+ Thêm</button>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Tên</th><th>Giá</th><th>Sức chứa</th><th>Giường</th><th>Tiện ích</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {list.map(r=> (
              <tr key={r.id}><td>{r.name}</td><td>{r.price}</td><td>{r.capacity}</td><td>{r.bed}</td><td>{(r.amenities||[]).join(', ')}</td><td>{r.status||'ACTIVE'}</td>
                <td><button onClick={()=> setEditing(r)}>Sửa</button> <button onClick={()=> remove(r.id)}>Xóa</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="form-panel">
          <label>Tên</label>
          <input value={editing.name} onChange={e=> setEditing({...editing, name: e.target.value})} />
          <label>Loại (Hotel / Homestay)</label>
          <select value={editing.property_type||'hotel'} onChange={e=> setEditing({...editing, property_type: e.target.value})}>
            <option value="hotel">Khách sạn</option>
            <option value="homestay">Homestay</option>
          </select>
          <label>Giá</label>
          <input type="number" value={editing.price} onChange={e=> setEditing({...editing, price: e.target.value})} />
          <label>Sức chứa</label>
          <input type="number" value={editing.capacity} onChange={e=> setEditing({...editing, capacity: e.target.value})} />
          <label>Giường</label>
          <input value={editing.bed} onChange={e=> setEditing({...editing, bed: e.target.value})} />
          <label>Tiện ích (phân cách ,)</label>
          <input value={(editing.amenities||[]).join(', ')} onChange={e=> setEditing({...editing, amenities: e.target.value.split(',').map(s=>s.trim())})} />
          <label>Hình ảnh</label>
          <input multiple type="file" accept="image/*" onChange={async (e)=>{
            const files = Array.from(e.target.files || [])
            if(files.length===0) return
            setUploading(true)
            try{
              const urls = []
              for(const f of files){
                const res = await api.uploadFile(f)
                urls.push(res.url)
              }
              setEditing({...editing, images: [...(editing.images||[]), ...urls]})
            }catch(er){ alert('Upload lỗi: '+er.message) }
            finally{ setUploading(false) }
          }} />
          <div style={{display:'flex',gap:8,marginTop:8}}>{(editing.images||[]).map((u,i)=> (
            <div key={i} style={{position:'relative'}}>
              <img src={u} alt="img" style={{width:80,height:60,objectFit:'cover',borderRadius:6}} />
              <button onClick={()=> setEditing({...editing, images: (editing.images||[]).filter(x=>x!==u)})} style={{position:'absolute',right:2,top:2,background:'#fff',borderRadius:6,border:'none',cursor:'pointer'}}>x</button>
            </div>
          ))}</div>
          <div className="form-actions"><button className="btn-add" onClick={()=> save(editing)} disabled={uploading}>Lưu</button> <button onClick={()=> setEditing(null)}>Hủy</button></div>
        </div>
      )}
    </div>
  )
}
