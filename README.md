# Hệ Thống Quản Lý Cửa Hàng FMSTYLE

Hệ thống quản lý cửa hàng với Node.js Express và SQLite.

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Khởi tạo database

```bash
npm run init-db
```

Lệnh này sẽ tạo file `store.db` và chèn dữ liệu mẫu.

### 3. Chạy server

```bash
npm start
```

Hoặc chạy với nodemon (tự động restart khi có thay đổi):

```bash
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

### 4. Mở trình duyệt

Mở file `index.html` hoặc truy cập: **http://localhost:3000**

## 📡 API Endpoints

- `GET /api/stats` - Lấy tất cả thống kê (khách hàng, nhân viên, hàng hóa, hóa đơn)
- `GET /api/stats/khachhang` - Tổng số khách hàng
- `GET /api/stats/nhanvien` - Tổng số nhân viên
- `GET /api/stats/hanghoa` - Tổng số hàng hóa
- `GET /api/stats/hoadon` - Tổng số hóa đơn trong tháng
- `GET /api/hoadon` - Danh sách hóa đơn
- `GET /api/khachhang` - Danh sách khách hàng
- `GET /api/nhanvien` - Danh sách nhân viên
- `GET /api/hanghoa` - Danh sách hàng hóa
- `GET /api/kho-phieunhap` - Thông tin kho và phiếu nhập
- `GET /api/health` - Health check

## 📁 Cấu trúc Project

```
.
├── index.html          # Frontend HTML
├── server.js           # Express server
├── init-db.js          # Script khởi tạo database
├── database.js         # (Không dùng nữa - đã chuyển sang server-side)
├── package.json        # Dependencies
├── store.db            # SQLite database (tự động tạo)
└── README.md           # File này
```

## 🔧 Technologies

- **Backend**: Node.js, Express.js
- **Database**: SQLite (better-sqlite3)
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## 📝 Lưu ý

- Database được lưu trong file `store.db`
- Để reset database, xóa file `store.db` và chạy lại `npm run init-db`
- Server mặc định chạy ở port 3000, có thể thay đổi bằng biến môi trường `PORT`
