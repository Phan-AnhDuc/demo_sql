const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');
const db = new Database(dbPath);

console.log('🔄 Đang khởi tạo database...');

// Tạo các bảng
function createTables() {
    console.log('📋 Đang tạo các bảng...');
    
    db.exec(`
        -- Bảng phân loại khách hàng
        CREATE TABLE IF NOT EXISTS PHANLOAI_KH(
            maPLKH TEXT PRIMARY KEY,
            tenPLKH TEXT NOT NULL,
            tongchi REAL,
            diemtichluy INTEGER CHECK(diemtichluy >= 0)
        );

        -- Bảng khách hàng
        CREATE TABLE IF NOT EXISTS KHACHHANG(
            maKH TEXT PRIMARY KEY,
            tenKH TEXT NOT NULL,
            maPLKH TEXT NOT NULL,
            diachi TEXT,
            sdt TEXT,
            FOREIGN KEY (maPLKH) REFERENCES PHANLOAI_KH(maPLKH)
        );

        -- Bảng phòng ban
        CREATE TABLE IF NOT EXISTS PHONGBAN(
            maPB TEXT PRIMARY KEY,
            tenPB TEXT NOT NULL
        );

        -- Bảng vị trí
        CREATE TABLE IF NOT EXISTS VITRI(
            maVT TEXT PRIMARY KEY,
            tenVT TEXT NOT NULL
        );

        -- Bảng nhân viên
        CREATE TABLE IF NOT EXISTS NHANVIEN(
            maNV TEXT PRIMARY KEY,
            tenNV TEXT NOT NULL,
            diachi TEXT,
            sdt TEXT,
            gioitinh INTEGER,
            luong REAL CHECK(luong >= 0),
            namsinh INTEGER CHECK(namsinh BETWEEN 1900 AND 2100),
            ngaylamviec TEXT,
            maPB TEXT NOT NULL,
            maVT TEXT NOT NULL,
            FOREIGN KEY (maPB) REFERENCES PHONGBAN(maPB),
            FOREIGN KEY (maVT) REFERENCES VITRI(maVT)
        );

        -- Bảng lịch sử theo dõi nhân viên
        CREATE TABLE IF NOT EXISTS LICHSUTHEODOINV(
            maLS TEXT PRIMARY KEY,
            thang INTEGER CHECK(thang BETWEEN 1 AND 12),
            nam INTEGER CHECK(nam BETWEEN 1900 AND 2100)
        );

        -- Bảng phiếu theo dõi nhân viên
        CREATE TABLE IF NOT EXISTS PHIEUTHEODOINV(
            maLS TEXT NOT NULL,
            maNV TEXT NOT NULL,
            ngaylam TEXT,
            ngaynghi TEXT,
            tongngaylam INTEGER CHECK(tongngaylam >= 0),
            tongngaynghi INTEGER CHECK(tongngaynghi >= 0),
            ngaytangca TEXT,
            PRIMARY KEY (maLS, maNV),
            FOREIGN KEY (maLS) REFERENCES LICHSUTHEODOINV(maLS),
            FOREIGN KEY (maNV) REFERENCES NHANVIEN(maNV)
        );

        -- Bảng nhà cung cấp
        CREATE TABLE IF NOT EXISTS NHACUNGCAP(
            maNCC TEXT PRIMARY KEY,
            tenNCC TEXT NOT NULL,
            diachi TEXT,
            sdt TEXT,
            email TEXT
        );

        -- Bảng hàng hóa
        CREATE TABLE IF NOT EXISTS HANGHOA(
            maHang TEXT PRIMARY KEY,
            loaihang TEXT NOT NULL,
            soluong INTEGER NOT NULL CHECK(soluong >= 0),
            ngaynhaphang TEXT,
            donvi TEXT,
            maNCC TEXT NOT NULL,
            gianhapvao REAL NOT NULL CHECK(gianhapvao >= 0),
            giabanra REAL NOT NULL CHECK(giabanra >= 0),
            FOREIGN KEY (maNCC) REFERENCES NHACUNGCAP(maNCC)
        );

        -- Bảng phiếu nhập
        CREATE TABLE IF NOT EXISTS PHIEUNHAP(
            maPN TEXT PRIMARY KEY,
            maNCC TEXT NOT NULL,
            ngaynhap TEXT,
            maNV TEXT NOT NULL,
            FOREIGN KEY (maNV) REFERENCES NHANVIEN(maNV),
            FOREIGN KEY (maNCC) REFERENCES NHACUNGCAP(maNCC)
        );

        -- Bảng chi tiết phiếu nhập
        CREATE TABLE IF NOT EXISTS CHITIETPHIEUNHAP(
            maPN TEXT NOT NULL,
            maHang TEXT NOT NULL,
            soluongnhap INTEGER CHECK(soluongnhap >= 0),
            PRIMARY KEY (maPN, maHang),
            FOREIGN KEY (maPN) REFERENCES PHIEUNHAP(maPN),
            FOREIGN KEY (maHang) REFERENCES HANGHOA(maHang)
        );

        -- Bảng hóa đơn
        CREATE TABLE IF NOT EXISTS HOADON(
            maHD TEXT PRIMARY KEY,
            maNV TEXT NOT NULL,
            ngaylap TEXT NOT NULL,
            tongtien REAL CHECK(tongtien >= 0),
            FOREIGN KEY (maNV) REFERENCES NHANVIEN(maNV)
        );

        -- Bảng chi tiết hóa đơn
        CREATE TABLE IF NOT EXISTS CHITIET_HD(
            maHD TEXT NOT NULL,
            maHang TEXT NOT NULL,
            soluong INTEGER CHECK(soluong >= 0),
            dongia REAL CHECK(dongia >= 0),
            chietkhau INTEGER CHECK(chietkhau >= 0),
            tongtien REAL CHECK(tongtien >= 0),
            PRIMARY KEY (maHD, maHang),
            FOREIGN KEY (maHD) REFERENCES HOADON(maHD),
            FOREIGN KEY (maHang) REFERENCES HANGHOA(maHang)
        );
    `);
    
    console.log('✅ Đã tạo các bảng thành công!');
}

// Insert dữ liệu mẫu
function insertSampleData() {
    console.log('📥 Đang chèn dữ liệu mẫu...');
    
    const insert = db.transaction((data) => {
        const stmt = db.prepare(data.sql);
        if (data.params) {
            stmt.run(...data.params);
        } else {
            stmt.run();
        }
    });

    // Phân loại khách hàng
    insert({ sql: `INSERT OR IGNORE INTO PHANLOAI_KH VALUES ('PL01', 'Thường', 0, 0)` });
    insert({ sql: `INSERT OR IGNORE INTO PHANLOAI_KH VALUES ('PL02', 'Bạc', 5000000, 100)` });
    insert({ sql: `INSERT OR IGNORE INTO PHANLOAI_KH VALUES ('PL03', 'Vàng', 10000000, 500)` });
    insert({ sql: `INSERT OR IGNORE INTO PHANLOAI_KH VALUES ('PL04', 'Kim Cương', 20000000, 1000)` });

    // Phòng ban
    insert({ sql: `INSERT OR IGNORE INTO PHONGBAN VALUES ('PB01', 'Bán hàng')` });
    insert({ sql: `INSERT OR IGNORE INTO PHONGBAN VALUES ('PB02', 'Kho')` });
    insert({ sql: `INSERT OR IGNORE INTO PHONGBAN VALUES ('PB03', 'Kế toán')` });

    // Vị trí
    insert({ sql: `INSERT OR IGNORE INTO VITRI VALUES ('VT01', 'Nhân viên bán hàng')` });
    insert({ sql: `INSERT OR IGNORE INTO VITRI VALUES ('VT02', 'Quản lý kho')` });
    insert({ sql: `INSERT OR IGNORE INTO VITRI VALUES ('VT03', 'Kế toán viên')` });

    // Nhân viên
    insert({ sql: `INSERT OR IGNORE INTO NHANVIEN VALUES ('NV01', 'Nguyễn Văn A', 'Huế', '0123456789', 1, 8000000, 1990, '2020-01-15', 'PB01', 'VT01')` });
    insert({ sql: `INSERT OR IGNORE INTO NHANVIEN VALUES ('NV02', 'Trần Thị B', 'Huế', '0987654321', 0, 7500000, 1992, '2020-03-20', 'PB01', 'VT01')` });
    insert({ sql: `INSERT OR IGNORE INTO NHANVIEN VALUES ('NV03', 'Lê Văn C', 'Huế', '0912345678', 1, 9000000, 1988, '2019-06-10', 'PB02', 'VT02')` });
    insert({ sql: `INSERT OR IGNORE INTO NHANVIEN VALUES ('NV04', 'Phạm Thị D', 'Huế', '0923456789', 0, 8500000, 1991, '2020-05-12', 'PB01', 'VT01')` });
    insert({ sql: `INSERT OR IGNORE INTO NHANVIEN VALUES ('NV05', 'Hoàng Văn E', 'Huế', '0934567890', 1, 7000000, 1993, '2021-02-01', 'PB01', 'VT01')` });
    insert({ sql: `INSERT OR IGNORE INTO NHANVIEN VALUES ('NV06', 'Võ Thị F', 'Huế', '0945678901', 0, 8000000, 1990, '2020-04-15', 'PB01', 'VT01')` });
    insert({ sql: `INSERT OR IGNORE INTO NHANVIEN VALUES ('NV07', 'Đặng Văn G', 'Huế', '0956789012', 1, 7500000, 1992, '2020-07-20', 'PB02', 'VT02')` });
    insert({ sql: `INSERT OR IGNORE INTO NHANVIEN VALUES ('NV08', 'Bùi Thị H', 'Huế', '0967890123', 0, 9000000, 1989, '2019-09-10', 'PB03', 'VT03')` });
    insert({ sql: `INSERT OR IGNORE INTO NHANVIEN VALUES ('NV09', 'Ngô Văn I', 'Huế', '0978901234', 1, 8500000, 1991, '2020-08-12', 'PB01', 'VT01')` });
    insert({ sql: `INSERT OR IGNORE INTO NHANVIEN VALUES ('NV10', 'Đinh Thị K', 'Huế', '0989012345', 0, 7000000, 1994, '2021-01-01', 'PB01', 'VT01')` });
    insert({ sql: `INSERT OR IGNORE INTO NHANVIEN VALUES ('NV11', 'Nguyễn Thị Hiền', 'Huế', '0989012345', 1, 6000000, 1994, '2004-01-25', 'PB01', 'VT01')` });

    // Khách hàng
    insert({ sql: `INSERT OR IGNORE INTO KHACHHANG VALUES ('KH01', 'Nguyễn Thị Lan', 'PL02', '171 Bà Triệu, Huế', '0901234567')` });
    insert({ sql: `INSERT OR IGNORE INTO KHACHHANG VALUES ('KH02', 'Trần Văn Minh', 'PL01', '45 Lê Lợi, Huế', '0912345678')` });
    insert({ sql: `INSERT OR IGNORE INTO KHACHHANG VALUES ('KH03', 'Lê Thị Hoa', 'PL03', '12 Nguyễn Huệ, Huế', '0923456789')` });
    insert({ sql: `INSERT OR IGNORE INTO KHACHHANG VALUES ('KH04', 'Phạm Văn Đức', 'PL01', '78 Trần Hưng Đạo, Huế', '0934567890')` });
    insert({ sql: `INSERT OR IGNORE INTO KHACHHANG VALUES ('KH05', 'Hoàng Thị Mai', 'PL02', '23 Hùng Vương, Huế', '0945678901')` });
    insert({ sql: `INSERT OR IGNORE INTO KHACHHANG VALUES ('KH06', 'Võ Văn Sơn', 'PL02', '56 Phan Đình Phùng, Huế', '0956789012')` });
    insert({ sql: `INSERT OR IGNORE INTO KHACHHANG VALUES ('KH07', 'Đặng Thị Linh', 'PL01', '89 Điện Biên Phủ, Huế', '0967890123')` });
    insert({ sql: `INSERT OR IGNORE INTO KHACHHANG VALUES ('KH08', 'Bùi Văn Tuấn', 'PL04', '34 Lý Thường Kiệt, Huế', '0978901234')` });
    insert({ sql: `INSERT OR IGNORE INTO KHACHHANG VALUES ('KH09', 'Ngô Thị Hương', 'PL03', '67 Đặng Thái Thân, Huế', '0989012345')` });
    insert({ sql: `INSERT OR IGNORE INTO KHACHHANG VALUES ('KH10', 'Đinh Văn Long', 'PL02', '90 Phạm Văn Đồng, Huế', '0990123456')` });

    // Nhà cung cấp
    insert({ sql: `INSERT OR IGNORE INTO NHACUNGCAP VALUES ('NCC01', 'Công ty Thời trang ABC', 'Hà Nội', '0241234567', 'abc@example.com')` });
    insert({ sql: `INSERT OR IGNORE INTO NHACUNGCAP VALUES ('NCC02', 'Công ty May mặc XYZ', 'TP.HCM', '0282345678', 'xyz@example.com')` });
    insert({ sql: `INSERT OR IGNORE INTO NHACUNGCAP VALUES ('NCC03', 'Công ty Giày dép DEF', 'Đà Nẵng', '0236345678', 'def@example.com')` });
    insert({ sql: `INSERT OR IGNORE INTO NHACUNGCAP VALUES ('NCC04', 'Công ty Phụ kiện GHI', 'Hà Nội', '0243456789', 'ghi@example.com')` });
    insert({ sql: `INSERT OR IGNORE INTO NHACUNGCAP VALUES ('NCC05', 'Công ty Thời trang JKL', 'TP.HCM', '0284567890', 'jkl@example.com')` });

    // Hàng hóa
    insert({ sql: `INSERT OR IGNORE INTO HANGHOA VALUES ('HH01', 'Áo thun', 120, '2024-01-10', 'Cái', 'NCC01', 150000, 250000)` });
    insert({ sql: `INSERT OR IGNORE INTO HANGHOA VALUES ('HH02', 'Quần jean', 80, '2024-01-15', 'Cái', 'NCC02', 300000, 500000)` });
    insert({ sql: `INSERT OR IGNORE INTO HANGHOA VALUES ('HH03', 'Áo sơ mi', 100, '2024-02-01', 'Cái', 'NCC01', 200000, 350000)` });
    insert({ sql: `INSERT OR IGNORE INTO HANGHOA VALUES ('HH04', 'Váy', 60, '2024-02-10', 'Cái', 'NCC02', 250000, 450000)` });
    insert({ sql: `INSERT OR IGNORE INTO HANGHOA VALUES ('HH05', 'Quần short', 90, '2024-02-20', 'Cái', 'NCC01', 180000, 300000)` });
    insert({ sql: `INSERT OR IGNORE INTO HANGHOA VALUES ('HH06', 'Áo khoác', 40, '2024-03-01', 'Cái', 'NCC05', 400000, 700000)` });
    insert({ sql: `INSERT OR IGNORE INTO HANGHOA VALUES ('HH07', 'Giày thể thao', 55, '2024-03-05', 'Đôi', 'NCC03', 500000, 850000)` });
    insert({ sql: `INSERT OR IGNORE INTO HANGHOA VALUES ('HH08', 'Giày cao gót', 35, '2024-03-10', 'Đôi', 'NCC03', 400000, 750000)` });
    insert({ sql: `INSERT OR IGNORE INTO HANGHOA VALUES ('HH09', 'Túi xách', 50, '2024-03-15', 'Cái', 'NCC04', 300000, 550000)` });
    insert({ sql: `INSERT OR IGNORE INTO HANGHOA VALUES ('HH10', 'Áo hoodie', 50, '2024-03-20', 'Cái', 'NCC05', 350000, 600000)` });

    // Phiếu nhập
    insert({ sql: `INSERT OR IGNORE INTO PHIEUNHAP VALUES ('PN01', 'NCC01', '2024-01-10', 'NV03')` });
    insert({ sql: `INSERT OR IGNORE INTO PHIEUNHAP VALUES ('PN02', 'NCC02', '2024-01-15', 'NV03')` });
    insert({ sql: `INSERT OR IGNORE INTO PHIEUNHAP VALUES ('PN03', 'NCC01', '2024-02-01', 'NV07')` });
    insert({ sql: `INSERT OR IGNORE INTO PHIEUNHAP VALUES ('PN04', 'NCC02', '2024-02-10', 'NV03')` });
    insert({ sql: `INSERT OR IGNORE INTO PHIEUNHAP VALUES ('PN05', 'NCC01', '2024-02-20', 'NV07')` });
    insert({ sql: `INSERT OR IGNORE INTO PHIEUNHAP VALUES ('PN06', 'NCC05', '2024-03-01', 'NV03')` });
    insert({ sql: `INSERT OR IGNORE INTO PHIEUNHAP VALUES ('PN07', 'NCC03', '2024-03-05', 'NV07')` });
    insert({ sql: `INSERT OR IGNORE INTO PHIEUNHAP VALUES ('PN08', 'NCC03', '2024-03-10', 'NV03')` });
    insert({ sql: `INSERT OR IGNORE INTO PHIEUNHAP VALUES ('PN09', 'NCC04', '2024-03-15', 'NV07')` });
    insert({ sql: `INSERT OR IGNORE INTO PHIEUNHAP VALUES ('PN10', 'NCC05', '2024-03-20', 'NV03')` });

    // Chi tiết phiếu nhập
    insert({ sql: `INSERT OR IGNORE INTO CHITIETPHIEUNHAP VALUES ('PN01', 'HH01', 50)` });
    insert({ sql: `INSERT OR IGNORE INTO CHITIETPHIEUNHAP VALUES ('PN02', 'HH02', 30)` });
    insert({ sql: `INSERT OR IGNORE INTO CHITIETPHIEUNHAP VALUES ('PN03', 'HH03', 40)` });
    insert({ sql: `INSERT OR IGNORE INTO CHITIETPHIEUNHAP VALUES ('PN07', 'HH07', 18)` });
    insert({ sql: `INSERT OR IGNORE INTO CHITIETPHIEUNHAP VALUES ('PN10', 'HH10', 28)` });

    // Hóa đơn
    insert({ sql: `INSERT OR IGNORE INTO HOADON VALUES ('HD01', 'NV01', '2024-06-10', 550000)` });
    insert({ sql: `INSERT OR IGNORE INTO HOADON VALUES ('HD02', 'NV02', '2024-06-12', 720000)` });
    insert({ sql: `INSERT OR IGNORE INTO HOADON VALUES ('HD03', 'NV03', '2024-06-15', 450000)` });
    insert({ sql: `INSERT OR IGNORE INTO HOADON VALUES ('HD04', 'NV04', '2024-06-18', 980000)` });
    insert({ sql: `INSERT OR IGNORE INTO HOADON VALUES ('HD05', 'NV05', '2024-06-20', 360000)` });
    insert({ sql: `INSERT OR IGNORE INTO HOADON VALUES ('HD06', 'NV06', '2024-06-21', 750000)` });
    insert({ sql: `INSERT OR IGNORE INTO HOADON VALUES ('HD07', 'NV07', '2024-06-22', 650000)` });
    insert({ sql: `INSERT OR IGNORE INTO HOADON VALUES ('HD08', 'NV08', '2024-06-25', 420000)` });
    insert({ sql: `INSERT OR IGNORE INTO HOADON VALUES ('HD09', 'NV09', '2024-06-28', 890000)` });
    insert({ sql: `INSERT OR IGNORE INTO HOADON VALUES ('HD10', 'NV10', '2024-06-30', 620000)` });

    // Chi tiết hóa đơn
    insert({ sql: `INSERT OR IGNORE INTO CHITIET_HD VALUES ('HD01', 'HH01', 2, 250000, 0, 500000)` });
    insert({ sql: `INSERT OR IGNORE INTO CHITIET_HD VALUES ('HD02', 'HH02', 1, 500000, 0, 500000)` });
    insert({ sql: `INSERT OR IGNORE INTO CHITIET_HD VALUES ('HD02', 'HH03', 1, 350000, 0, 350000)` });
    insert({ sql: `INSERT OR IGNORE INTO CHITIET_HD VALUES ('HD03', 'HH05', 1, 300000, 0, 300000)` });
    insert({ sql: `INSERT OR IGNORE INTO CHITIET_HD VALUES ('HD04', 'HH06', 1, 700000, 0, 700000)` });
    
    console.log('✅ Đã chèn dữ liệu mẫu thành công!');
}

// Main
try {
    createTables();
    insertSampleData();
    console.log('✨ Khởi tạo database hoàn tất!');
    db.close();
} catch (error) {
    console.error('❌ Lỗi:', error);
    db.close();
    process.exit(1);
}

