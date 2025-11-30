// SQL.js Database Manager cho hệ thống quản lý cửa hàng FMSTYLE
let db = null;
let SQL = null;

// Khởi tạo database khi trang được load
async function initDatabase() {
    try {
        // Load SQL.js library từ CDN
        if (!SQL) {
            SQL = await initSqlJs({
                locateFile: file => `https://sql.js.org/dist/${file}`
            });
        }

        // Tạo database mới
        db = new SQL.Database();

        // Tạo các bảng theo schema SQL Server (chuyển đổi sang SQLite)
        createTables();
        
        // Insert dữ liệu mẫu
        insertSampleData();

        console.log('Database đã được khởi tạo thành công!');
        return true;
    } catch (error) {
        console.error('Lỗi khởi tạo database:', error);
        return false;
    }
}

// Tạo các bảng
function createTables() {
    const createTableSQL = `
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
    `;

    db.run(createTableSQL);
}

// Insert dữ liệu mẫu
function insertSampleData() {
    // Phân loại khách hàng
    db.run(`INSERT INTO PHANLOAI_KH VALUES ('PL01', 'Thường', 0, 0)`);
    db.run(`INSERT INTO PHANLOAI_KH VALUES ('PL02', 'Bạc', 5000000, 100)`);
    db.run(`INSERT INTO PHANLOAI_KH VALUES ('PL03', 'Vàng', 10000000, 500)`);
    db.run(`INSERT INTO PHANLOAI_KH VALUES ('PL04', 'Kim Cương', 20000000, 1000)`);

    // Phòng ban
    db.run(`INSERT INTO PHONGBAN VALUES ('PB01', 'Bán hàng')`);
    db.run(`INSERT INTO PHONGBAN VALUES ('PB02', 'Kho')`);
    db.run(`INSERT INTO PHONGBAN VALUES ('PB03', 'Kế toán')`);

    // Vị trí
    db.run(`INSERT INTO VITRI VALUES ('VT01', 'Nhân viên bán hàng')`);
    db.run(`INSERT INTO VITRI VALUES ('VT02', 'Quản lý kho')`);
    db.run(`INSERT INTO VITRI VALUES ('VT03', 'Kế toán viên')`);

    // Nhân viên
    db.run(`INSERT INTO NHANVIEN VALUES ('NV01', 'Nguyễn Văn A', 'Huế', '0123456789', 1, 8000000, 1990, '2020-01-15', 'PB01', 'VT01')`);
    db.run(`INSERT INTO NHANVIEN VALUES ('NV02', 'Trần Thị B', 'Huế', '0987654321', 0, 7500000, 1992, '2020-03-20', 'PB01', 'VT01')`);
    db.run(`INSERT INTO NHANVIEN VALUES ('NV03', 'Lê Văn C', 'Huế', '0912345678', 1, 9000000, 1988, '2019-06-10', 'PB02', 'VT02')`);
    db.run(`INSERT INTO NHANVIEN VALUES ('NV04', 'Phạm Thị D', 'Huế', '0923456789', 0, 8500000, 1991, '2020-05-12', 'PB01', 'VT01')`);
    db.run(`INSERT INTO NHANVIEN VALUES ('NV05', 'Hoàng Văn E', 'Huế', '0934567890', 1, 7000000, 1993, '2021-02-01', 'PB01', 'VT01')`);
    db.run(`INSERT INTO NHANVIEN VALUES ('NV06', 'Võ Thị F', 'Huế', '0945678901', 0, 8000000, 1990, '2020-04-15', 'PB01', 'VT01')`);
    db.run(`INSERT INTO NHANVIEN VALUES ('NV07', 'Đặng Văn G', 'Huế', '0956789012', 1, 7500000, 1992, '2020-07-20', 'PB02', 'VT02')`);
    db.run(`INSERT INTO NHANVIEN VALUES ('NV08', 'Bùi Thị H', 'Huế', '0967890123', 0, 9000000, 1989, '2019-09-10', 'PB03', 'VT03')`);
    db.run(`INSERT INTO NHANVIEN VALUES ('NV09', 'Ngô Văn I', 'Huế', '0978901234', 1, 8500000, 1991, '2020-08-12', 'PB01', 'VT01')`);
    db.run(`INSERT INTO NHANVIEN VALUES ('NV10', 'Đinh Thị K', 'Huế', '0989012345', 0, 7000000, 1994, '2021-01-01', 'PB01', 'VT01')`);
    db.run(`INSERT INTO NHANVIEN VALUES ('NV11', 'Nguyễn Thị Hiền', 'Huế', '0989012345', 1, 6000000, 1994, '2004-01-25', 'PB01', 'VT01')`);

    // Khách hàng
    db.run(`INSERT INTO KHACHHANG VALUES ('KH01', 'Nguyễn Thị Lan', 'PL02', '171 Bà Triệu, Huế', '0901234567')`);
    db.run(`INSERT INTO KHACHHANG VALUES ('KH02', 'Trần Văn Minh', 'PL01', '45 Lê Lợi, Huế', '0912345678')`);
    db.run(`INSERT INTO KHACHHANG VALUES ('KH03', 'Lê Thị Hoa', 'PL03', '12 Nguyễn Huệ, Huế', '0923456789')`);
    db.run(`INSERT INTO KHACHHANG VALUES ('KH04', 'Phạm Văn Đức', 'PL01', '78 Trần Hưng Đạo, Huế', '0934567890')`);
    db.run(`INSERT INTO KHACHHANG VALUES ('KH05', 'Hoàng Thị Mai', 'PL02', '23 Hùng Vương, Huế', '0945678901')`);
    db.run(`INSERT INTO KHACHHANG VALUES ('KH06', 'Võ Văn Sơn', 'PL02', '56 Phan Đình Phùng, Huế', '0956789012')`);
    db.run(`INSERT INTO KHACHHANG VALUES ('KH07', 'Đặng Thị Linh', 'PL01', '89 Điện Biên Phủ, Huế', '0967890123')`);
    db.run(`INSERT INTO KHACHHANG VALUES ('KH08', 'Bùi Văn Tuấn', 'PL04', '34 Lý Thường Kiệt, Huế', '0978901234')`);
    db.run(`INSERT INTO KHACHHANG VALUES ('KH09', 'Ngô Thị Hương', 'PL03', '67 Đặng Thái Thân, Huế', '0989012345')`);
    db.run(`INSERT INTO KHACHHANG VALUES ('KH10', 'Đinh Văn Long', 'PL02', '90 Phạm Văn Đồng, Huế', '0990123456')`);

    // Nhà cung cấp
    db.run(`INSERT INTO NHACUNGCAP VALUES ('NCC01', 'Công ty Thời trang ABC', 'Hà Nội', '0241234567', 'abc@example.com')`);
    db.run(`INSERT INTO NHACUNGCAP VALUES ('NCC02', 'Công ty May mặc XYZ', 'TP.HCM', '0282345678', 'xyz@example.com')`);
    db.run(`INSERT INTO NHACUNGCAP VALUES ('NCC03', 'Công ty Giày dép DEF', 'Đà Nẵng', '0236345678', 'def@example.com')`);
    db.run(`INSERT INTO NHACUNGCAP VALUES ('NCC04', 'Công ty Phụ kiện GHI', 'Hà Nội', '0243456789', 'ghi@example.com')`);
    db.run(`INSERT INTO NHACUNGCAP VALUES ('NCC05', 'Công ty Thời trang JKL', 'TP.HCM', '0284567890', 'jkl@example.com')`);

    // Hàng hóa
    db.run(`INSERT INTO HANGHOA VALUES ('HH01', 'Áo thun', 120, '2024-01-10', 'Cái', 'NCC01', 150000, 250000)`);
    db.run(`INSERT INTO HANGHOA VALUES ('HH02', 'Quần jean', 80, '2024-01-15', 'Cái', 'NCC02', 300000, 500000)`);
    db.run(`INSERT INTO HANGHOA VALUES ('HH03', 'Áo sơ mi', 100, '2024-02-01', 'Cái', 'NCC01', 200000, 350000)`);
    db.run(`INSERT INTO HANGHOA VALUES ('HH04', 'Váy', 60, '2024-02-10', 'Cái', 'NCC02', 250000, 450000)`);
    db.run(`INSERT INTO HANGHOA VALUES ('HH05', 'Quần short', 90, '2024-02-20', 'Cái', 'NCC01', 180000, 300000)`);
    db.run(`INSERT INTO HANGHOA VALUES ('HH06', 'Áo khoác', 40, '2024-03-01', 'Cái', 'NCC05', 400000, 700000)`);
    db.run(`INSERT INTO HANGHOA VALUES ('HH07', 'Giày thể thao', 55, '2024-03-05', 'Đôi', 'NCC03', 500000, 850000)`);
    db.run(`INSERT INTO HANGHOA VALUES ('HH08', 'Giày cao gót', 35, '2024-03-10', 'Đôi', 'NCC03', 400000, 750000)`);
    db.run(`INSERT INTO HANGHOA VALUES ('HH09', 'Túi xách', 50, '2024-03-15', 'Cái', 'NCC04', 300000, 550000)`);
    db.run(`INSERT INTO HANGHOA VALUES ('HH10', 'Áo hoodie', 50, '2024-03-20', 'Cái', 'NCC05', 350000, 600000)`);

    // Phiếu nhập
    db.run(`INSERT INTO PHIEUNHAP VALUES ('PN01', 'NCC01', '2024-01-10', 'NV03')`);
    db.run(`INSERT INTO PHIEUNHAP VALUES ('PN02', 'NCC02', '2024-01-15', 'NV03')`);
    db.run(`INSERT INTO PHIEUNHAP VALUES ('PN03', 'NCC01', '2024-02-01', 'NV07')`);
    db.run(`INSERT INTO PHIEUNHAP VALUES ('PN04', 'NCC02', '2024-02-10', 'NV03')`);
    db.run(`INSERT INTO PHIEUNHAP VALUES ('PN05', 'NCC01', '2024-02-20', 'NV07')`);
    db.run(`INSERT INTO PHIEUNHAP VALUES ('PN06', 'NCC05', '2024-03-01', 'NV03')`);
    db.run(`INSERT INTO PHIEUNHAP VALUES ('PN07', 'NCC03', '2024-03-05', 'NV07')`);
    db.run(`INSERT INTO PHIEUNHAP VALUES ('PN08', 'NCC03', '2024-03-10', 'NV03')`);
    db.run(`INSERT INTO PHIEUNHAP VALUES ('PN09', 'NCC04', '2024-03-15', 'NV07')`);
    db.run(`INSERT INTO PHIEUNHAP VALUES ('PN10', 'NCC05', '2024-03-20', 'NV03')`);

    // Chi tiết phiếu nhập
    db.run(`INSERT INTO CHITIETPHIEUNHAP VALUES ('PN01', 'HH01', 50)`);
    db.run(`INSERT INTO CHITIETPHIEUNHAP VALUES ('PN02', 'HH02', 30)`);
    db.run(`INSERT INTO CHITIETPHIEUNHAP VALUES ('PN03', 'HH03', 40)`);
    db.run(`INSERT INTO CHITIETPHIEUNHAP VALUES ('PN07', 'HH07', 18)`);
    db.run(`INSERT INTO CHITIETPHIEUNHAP VALUES ('PN10', 'HH10', 28)`);

    // Hóa đơn (không có maKH trong schema gốc, nhưng có thể lấy từ CHITIET_HD thông qua logic khác)
    db.run(`INSERT INTO HOADON VALUES ('HD01', 'NV01', '2024-06-10', 550000)`);
    db.run(`INSERT INTO HOADON VALUES ('HD02', 'NV02', '2024-06-12', 720000)`);
    db.run(`INSERT INTO HOADON VALUES ('HD03', 'NV03', '2024-06-15', 450000)`);
    db.run(`INSERT INTO HOADON VALUES ('HD04', 'NV04', '2024-06-18', 980000)`);
    db.run(`INSERT INTO HOADON VALUES ('HD05', 'NV05', '2024-06-20', 360000)`);
    db.run(`INSERT INTO HOADON VALUES ('HD06', 'NV06', '2024-06-21', 750000)`);
    db.run(`INSERT INTO HOADON VALUES ('HD07', 'NV07', '2024-06-22', 650000)`);
    db.run(`INSERT INTO HOADON VALUES ('HD08', 'NV08', '2024-06-25', 420000)`);
    db.run(`INSERT INTO HOADON VALUES ('HD09', 'NV09', '2024-06-28', 890000)`);
    db.run(`INSERT INTO HOADON VALUES ('HD10', 'NV10', '2024-06-30', 620000)`);

    // Chi tiết hóa đơn
    db.run(`INSERT INTO CHITIET_HD VALUES ('HD01', 'HH01', 2, 250000, 0, 500000)`);
    db.run(`INSERT INTO CHITIET_HD VALUES ('HD02', 'HH02', 1, 500000, 0, 500000)`);
    db.run(`INSERT INTO CHITIET_HD VALUES ('HD02', 'HH03', 1, 350000, 0, 350000)`);
    db.run(`INSERT INTO CHITIET_HD VALUES ('HD03', 'HH05', 1, 300000, 0, 300000)`);
    db.run(`INSERT INTO CHITIET_HD VALUES ('HD04', 'HH06', 1, 700000, 0, 700000)`);
}

// Các hàm query dữ liệu
function query(sql, params = []) {
    try {
        const stmt = db.prepare(sql);
        if (params.length > 0) {
            stmt.bind(params);
        }
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    } catch (error) {
        console.error('Lỗi query:', error, sql);
        return [];
    }
}

// Lấy tất cả hóa đơn
function getAllHoaDon() {
    return query(`
        SELECT hd.maHD, hd.ngaylap, nv.tenNV, nv.maNV, hd.tongtien
        FROM HOADON hd
        LEFT JOIN NHANVIEN nv ON hd.maNV = nv.maNV
        ORDER BY hd.ngaylap DESC
    `);
}

// Lấy danh sách khách hàng
function getAllKhachHang() {
    return query(`SELECT maKH, tenKH FROM KHACHHANG ORDER BY maKH`);
}

// Lấy tổng số khách hàng
function getTongKhachHang() {
    const result = query(`SELECT COUNT(*) as count FROM KHACHHANG`);
    return result[0]?.count || 0;
}

// Lấy tổng số nhân viên
function getTongNhanVien() {
    const result = query(`SELECT COUNT(*) as count FROM NHANVIEN`);
    return result[0]?.count || 0;
}

// Lấy tổng số hàng hóa
function getTongHangHoa() {
    const result = query(`SELECT COUNT(*) as count FROM HANGHOA`);
    return result[0]?.count || 0;
}

// Lấy tổng số hóa đơn trong tháng
function getTongHoaDonThang() {
    const result = query(`
        SELECT COUNT(*) as count 
        FROM HOADON 
        WHERE strftime('%m', ngaylap) = strftime('%m', 'now')
    `);
    return result[0]?.count || 0;
}

// Lấy thông tin kho và phiếu nhập
function getKhoVaPhieuNhap() {
    return query(`
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
    `);
}

// Format ngày từ SQLite (YYYY-MM-DD) sang DD/MM/YYYY
function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

// Format số tiền
function formatCurrency(amount) {
    if (!amount) return '0';
    return new Intl.NumberFormat('vi-VN').format(amount);
}

