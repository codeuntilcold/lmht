# LIÊN MINH SĂM SOI CLONE

### Các bước để chạy:
1. Tải và cài đặt `nodejs` bản 16.x.x
2. Vào thư mục của project, chạy `npm install`
3. Tạo một file tên là .env rồi ghi vô nội dung ni nha:
```
NODE_ORACLEDB_USER = username của cái connection
NODE_ORACLEDB_PASSWORD = mật khẩu của cái connection
```

Sau đó chạy thử `node test_connection.js` xem console có in ra `CLAN` không nha.

Functions:
```
getConnection, 
startup, shutdown
createPool, getPool
initOracleClient
```
