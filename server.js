const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files (HTML, CSS, JS)

// Kết nối database
const dbPath = path.join(__dirname, 'store.db');
const db = new Database(dbPath);

// API Routes

// Lấy tổng số khách hàng
app.get('/api/stats/khachhang', (req, res) => {
    try {
        const result = db.prepare('SELECT COUNT(*) as count FROM KHACHHANG').get();
        res.json({ count: result.count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy tổng số nhân viên
app.get('/api/stats/nhanvien', (req, res) => {
    try {
        const result = db.prepare('SELECT COUNT(*) as count FROM NHANVIEN').get();
        res.json({ count: result.count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy tổng số hàng hóa
app.get('/api/stats/hanghoa', (req, res) => {
    try {
        const result = db.prepare('SELECT COUNT(*) as count FROM HANGHOA').get();
        res.json({ count: result.count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy tổng số hóa đơn trong tháng
app.get('/api/stats/hoadon', (req, res) => {
    try {
        const result = db.prepare(`
            SELECT COUNT(*) as count 
            FROM HOADON 
            WHERE strftime('%m', ngaylap) = strftime('%m', 'now')
        `).get();
        res.json({ count: result.count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy tất cả thống kê
app.get('/api/stats', (req, res) => {
    try {
        const stats = {
            khachhang: db.prepare('SELECT COUNT(*) as count FROM KHACHHANG').get().count,
            nhanvien: db.prepare('SELECT COUNT(*) as count FROM NHANVIEN').get().count,
            hanghoa: db.prepare('SELECT COUNT(*) as count FROM HANGHOA').get().count,
            hoadon: db.prepare(`
                SELECT COUNT(*) as count 
                FROM HOADON 
                WHERE strftime('%m', ngaylap) = strftime('%m', 'now')
            `).get().count
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy tất cả hóa đơn
app.get('/api/hoadon', (req, res) => {
    try {
        const hoaDons = db.prepare(`
            SELECT hd.maHD, hd.ngaylap, nv.tenNV, nv.maNV, hd.tongtien
            FROM HOADON hd
            LEFT JOIN NHANVIEN nv ON hd.maNV = nv.maNV
            ORDER BY hd.ngaylap DESC
        `).all();
        res.json(hoaDons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy danh sách khách hàng
app.get('/api/khachhang', (req, res) => {
    try {
        const khachHangs = db.prepare('SELECT maKH, tenKH FROM KHACHHANG ORDER BY maKH').all();
        res.json(khachHangs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy thông tin kho và phiếu nhập
app.get('/api/kho-phieunhap', (req, res) => {
    try {
        const khoData = db.prepare(`
            SELECT 
                hh.maHang,
                hh.loaihang,
                hh.soluong,
                pn.maPN,
                ncc.tenNCC,
                ctpn.soluongnhap
            FROM HANGHOA hh
            LEFT JOIN CHITIETPHIEUNHAP ctpn ON hh.maHang = ctpn.maHang
            LEFT JOIN PHIEUNHAP pn ON ctpn.maPN = pn.maPN
            LEFT JOIN NHACUNGCAP ncc ON pn.maNCC = ncc.maNCC
            ORDER BY hh.maHang
            LIMIT 5
        `).all();
        res.json(khoData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy tất cả nhân viên
app.get('/api/nhanvien', (req, res) => {
    try {
        const nhanViens = db.prepare('SELECT * FROM NHANVIEN ORDER BY maNV').all();
        res.json(nhanViens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy tất cả hàng hóa
app.get('/api/hanghoa', (req, res) => {
    try {
        const hangHoas = db.prepare('SELECT * FROM HANGHOA ORDER BY maHang').all();
        res.json(hangHoas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server đang chạy' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   GET /api/stats - Lấy tất cả thống kê`);
    console.log(`   GET /api/hoadon - Lấy danh sách hóa đơn`);
    console.log(`   GET /api/khachhang - Lấy danh sách khách hàng`);
    console.log(`   GET /api/kho-phieunhap - Lấy thông tin kho`);
});

