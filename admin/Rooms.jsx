import React, { useEffect, useState } from 'react'
import { api } from './api'

export default function Rooms(){
  const [list, setList] = useState([])
  const [types, setTypes] = useState([])
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(()=>{ api.listRooms().then(setList).catch(()=>setList([])); api.listRoomTypes().then(setTypes).catch(()=>setTypes([])) }, [])

  async function save(r){
    try{
      if(r.id) await api.updateRoom(r.id, r)
      else await api.createRoom(r)
      setList(await api.listRooms())
      setEditing(null)
    }catch(e){ alert('Lỗi: '+e.message) }
  }

  async function remove(id){
    if(!confirm('Xác nhận xóa phòng?')) return
    try{ await api.deleteRoom(id); setList(await api.listRooms()) }catch(e){ alert(e.message) }
  }

  return (
    <div>
      <h3>Phòng</h3>
      <button className="btn-add" onClick={()=> setEditing({number:'',roomTypeId:'',images:[]})}>+ Thêm phòng</button>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Số</th><th>Loại</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {list.map(r=> (
              <tr key={r.id}><td>{r.number}</td><td>{(types.find(t=>t.id===r.roomTypeId)||{}).name}</td><td>{r.status||'ACTIVE'}</td>
                <td><button onClick={()=> setEditing(r)}>Sửa</button> <button onClick={()=> remove(r.id)}>Xóa</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="form-panel">
          <label>Số phòng</label>
          <input value={editing.number} onChange={e=> setEditing({...editing, number: e.target.value})} />
          <label>Loại phòng</label>
          <select value={editing.roomTypeId} onChange={e=> setEditing({...editing, roomTypeId: e.target.value})}>
            <option value="">-- Chọn --</option>
            {types.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <label>Hình ảnh</label>
          <input multiple type="file" accept="image/*" onChange={async (e)=>{
            const files = Array.from(e.target.files || [])
            if(files.length===0) return
            setUploading(true)
            try{
              const urls = []
              for(const f of files){ const res = await api.uploadFile(f); urls.push(res.url) }
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
