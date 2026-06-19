Danh sách file backend (trong project hiện tại):

- backend/server.js
- backend/database.js

Ghi chú:

- `backend/` chứa server Express và mã kết nối PostgreSQL (sử dụng `pg` Pool).
- `backend/database.js` cung cấp `pool` và helper `query(text, params)` để thực hiện truy vấn an toàn (client.release() trong finally).
- Phần frontend giữ nguyên trong `src/` và tệp cấu hình gốc ở root.
- Nếu bạn muốn tôi di chuyển thêm file (ví dụ API khác), hãy nói rõ.
