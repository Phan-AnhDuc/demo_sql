CREATE DATABASE HeThongQuanLyCuaHang_FMSTYLE;
GO

USE HeThongQuanLyCuaHang_FMSTYLE;
GO

-- =============================================
-- BẢNG CƠ BẢN
-- =============================================

-- Bảng LỊCH SỬ THEO DÕI NHÂN VIÊN
CREATE TABLE LICHSUTHEODOINV(
    maLS nvarchar(10) NOT NULL,
    thang tinyint CHECK (thang BETWEEN 1 AND 12),
    nam smallint CHECK (nam BETWEEN 1900 AND 2100), 
    CONSTRAINT pkLS PRIMARY KEY (maLS)
);

-- Bảng PHÒNG BAN
CREATE TABLE PHONGBAN (
    maPB nvarchar(10) NOT NULL,
    tenPB nvarchar(40) NOT NULL,
    CONSTRAINT pkPB PRIMARY KEY(maPB)
);

-- Bảng VỊ TRÍ
CREATE TABLE VITRI (
    maVT nvarchar(10) NOT NULL,
    tenVT nvarchar(40) NOT NULL,
    CONSTRAINT pkVT PRIMARY KEY(maVT)
);

-- Bảng NHÀ CUNG CẤP
CREATE TABLE NHACUNGCAP(
    maNCC nvarchar(10) NOT NULL,
    tenNCC nvarchar(50) NOT NULL,
    diachi nvarchar(50),
    sdt varchar(10),
    email varchar(50),
    CONSTRAINT pkNCC PRIMARY KEY(maNCC)
);

-- Bảng PHÂN LOẠI KHÁCH HÀNG
CREATE TABLE PHANLOAI_KH(
    maPLKH nvarchar(10) NOT NULL,
    tenPLKH nvarchar(40) NOT NULL,
    tongchi money,
    diemtichluy int CHECK(diemtichluy >= 0),
    CONSTRAINT pkPLKH PRIMARY KEY(maPLKH)
);

-- Bảng KHÁCH HÀNG
CREATE TABLE KHACHHANG(
    maKH nvarchar(10) NOT NULL,
    tenKH nvarchar(40) NOT NULL,
    maPLKH nvarchar(10) NOT NULL,
    diachi nvarchar(50) NULL,
    sdt varchar(10) NULL,
    CONSTRAINT pkKH PRIMARY KEY(maKH),
    CONSTRAINT fkKH_PLKH FOREIGN KEY (maPLKH)
        REFERENCES PHANLOAI_KH(maPLKH)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Bảng NHÂN VIÊN
CREATE TABLE NHANVIEN(
    maNV nvarchar(10) NOT NULL,
    tenNV nvarchar(40) NOT NULL,
    diachi nvarchar(50),
    sdt varchar(10),
    gioitinh bit,
    luong decimal(18,2) CHECK(luong >= 0),
    namsinh int CHECK(namsinh BETWEEN 1900 AND 2100),
    ngaylamviec date,
    maPB nvarchar(10) NOT NULL,
    maVT nvarchar(10) NOT NULL,
    CONSTRAINT pkNV PRIMARY KEY(maNV),
    CONSTRAINT fkNHANVIEN_VT FOREIGN KEY(maVT)
        REFERENCES VITRI(maVT)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkNHANVIEN_PB FOREIGN KEY(maPB)
        REFERENCES PHONGBAN(maPB)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Bảng PHIẾU THEO DÕI NHÂN VIÊN
CREATE TABLE PHIEUTHEODOINV (
    maLS nvarchar(10) NOT NULL,
    maNV nvarchar(10) NOT NULL,
    ngaylam date NULL,
    ngaynghi date NULL,
    tongngaylam int NULL CHECK(tongngaylam >= 0),
    tongngaynghi int NULL CHECK(tongngaynghi >= 0),
    ngaytangca date NULL,
    CONSTRAINT pk_PTDNV PRIMARY KEY(maLS, maNV),
    CONSTRAINT fk_PT_maLS FOREIGN KEY (maLS)
        REFERENCES LICHSUTHEODOINV(maLS)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_PT_maNV FOREIGN KEY (maNV)
        REFERENCES NHANVIEN(maNV)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Bảng HÀNG HÓA
CREATE TABLE HANGHOA(
    maHang nvarchar(10) NOT NULL,
    loaihang nvarchar(40) NOT NULL,
    soluong int NOT NULL CHECK(soluong >= 0),
    ngaynhaphang date,
    donvi nvarchar(20),
    maNCC nvarchar(10) NOT NULL,
    gianhapvao decimal(18,2) NOT NULL CHECK(gianhapvao >= 0),
    giabanra decimal(18,2) NOT NULL CHECK(giabanra >= 0),
    CONSTRAINT pkHH PRIMARY KEY(maHang),
    CONSTRAINT fkHH_NCC FOREIGN KEY(maNCC)
        REFERENCES NHACUNGCAP(maNCC)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Bảng PHIẾU NHẬP
CREATE TABLE PHIEUNHAP(
    maPN nvarchar(10) NOT NULL,
    maNCC nvarchar(10) NOT NULL,
    ngaynhap date NULL,
    maNV nvarchar(10) NOT NULL,
    CONSTRAINT pkPN PRIMARY KEY (maPN),
    CONSTRAINT fkPHIEUNHAP_NV FOREIGN KEY (maNV)
        REFERENCES NHANVIEN(maNV)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkPHIEUNHAP_NCC FOREIGN KEY (maNCC)
        REFERENCES NHACUNGCAP(maNCC)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Bảng CHI TIẾT PHIẾU NHẬP
CREATE TABLE CHITIETPHIEUNHAP(
    maPN nvarchar(10) NOT NULL,
    maHang nvarchar(10) NOT NULL,
    soluongnhap int CHECK(soluongnhap >= 0),
    CONSTRAINT pk_CTPN PRIMARY KEY (maPN, maHang),
    CONSTRAINT fkCT_PN FOREIGN KEY(maPN)
        REFERENCES PHIEUNHAP(maPN)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkCT_HH FOREIGN KEY(maHang)
        REFERENCES HANGHOA(maHang)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

-- =============================================
-- BẢNG MÃ GIẢM GIÁ (MỚI)
-- =============================================

-- Bảng MÃ GIẢM GIÁ
CREATE TABLE MAGIAMGIA(
    maMGG nvarchar(10) NOT NULL,
    code nvarchar(20) NOT NULL UNIQUE,
    phantramgiam int NOT NULL CHECK(phantramgiam >= 0 AND phantramgiam <= 100),
    ngaybatdau date NULL,
    ngayketthuc date NULL,
    trangthai bit DEFAULT 1, -- 1: Còn hiệu lực, 0: Hết hiệu lực
    soluongsudung int DEFAULT 0 CHECK(soluongsudung >= 0),
    gioihan int NULL CHECK(gioihan >= 0), -- Giới hạn số lần sử dụng (NULL = không giới hạn)
    mota nvarchar(200) NULL,
    CONSTRAINT pk_MGG PRIMARY KEY(maMGG)
);

-- =============================================
-- BẢNG HÓA ĐƠN (CẬP NHẬT)
-- =============================================

-- Bảng HÓA ĐƠN (có thêm mã giảm giá và khách hàng)
CREATE TABLE HOADON(
    maHD nvarchar(10) NOT NULL,
    maNV nvarchar(10) NOT NULL,
    maKH nvarchar(10) NULL, -- Mã khách hàng
    ngaylap date NOT NULL,
    tongtien decimal(18,2) CHECK(tongtien >= 0),
    maMGG nvarchar(10) NULL, -- Mã giảm giá áp dụng
    tiengiamgia decimal(18,2) DEFAULT 0 CHECK(tiengiamgia >= 0), -- Số tiền được giảm
    CONSTRAINT pkHD PRIMARY KEY (maHD),
    CONSTRAINT fkHD_NV FOREIGN KEY(maNV)
        REFERENCES NHANVIEN(maNV)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkHD_KH FOREIGN KEY(maKH)
        REFERENCES KHACHHANG(maKH)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_HD_MGG FOREIGN KEY(maMGG)
        REFERENCES MAGIAMGIA(maMGG)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Bảng CHI TIẾT HÓA ĐƠN
CREATE TABLE CHITIET_HD(
    maHD nvarchar(10) NOT NULL,
    maHang nvarchar(10) NOT NULL,
    soluong int CHECK(soluong >= 0),
    dongia decimal(18,2) CHECK(dongia >= 0),
    chietkhau int CHECK(chietkhau >= 0),
    tongtien decimal(18,2) CHECK(tongtien >= 0),
    CONSTRAINT pk_CTHD PRIMARY KEY (maHD, maHang),
    CONSTRAINT fkCTHD_HD FOREIGN KEY(maHD)
        REFERENCES HOADON(maHD)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkCTHD_HH FOREIGN KEY(maHang)
        REFERENCES HANGHOA(maHang)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =============================================
-- BẢNG LỊCH SỬ SỬ DỤNG MÃ GIẢM GIÁ (MỚI)
-- =============================================

-- Bảng LỊCH SỬ SỬ DỤNG MÃ GIẢM GIÁ
CREATE TABLE LICHSU_SUDUNG_MGG(
    maLSSD nvarchar(10) NOT NULL,
    maMGG nvarchar(10) NOT NULL,
    maHD nvarchar(10) NOT NULL,
    ngaysudung date NOT NULL DEFAULT GETDATE(),
    sotiengiamgia decimal(18,2) CHECK(sotiengiamgia >= 0),
    CONSTRAINT pk_LSSD_MGG PRIMARY KEY(maLSSD),
    CONSTRAINT fk_LSSD_MGG FOREIGN KEY(maMGG)
        REFERENCES MAGIAMGIA(maMGG)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT fk_LSSD_HD FOREIGN KEY(maHD)
        REFERENCES HOADON(maHD)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

-- =============================================
-- HƯỚNG DẪN CÀI ĐẶT FONT CHO XUẤT PDF
-- =============================================

Để xuất PDF tiếng Việt không bị lỗi font, bạn cần cài đặt font hỗ trợ tiếng Việt:

1. Tự động tải font (Khuyến nghị):
   - Chạy lệnh: node download-fonts.js
   - Script sẽ tự động tải font Noto Sans vào thư mục ./fonts/

2. Thủ công:
   - Tải font Noto Sans từ: https://fonts.google.com/noto/specimen/Noto+Sans
   - Tạo thư mục ./fonts/ trong thư mục dự án
   - Đặt các file font sau vào thư mục fonts/:
     * NotoSans-Regular.ttf
     * NotoSans-Bold.ttf

3. Hệ thống sẽ tự động sử dụng font hệ thống Windows (Arial, Tahoma) nếu không tìm thấy font trong thư mục ./fonts/

Lưu ý: Excel export hoạt động tốt với tiếng Việt vì ExcelJS tự động hỗ trợ UTF-8.
PDF export cần font hỗ trợ Unicode để hiển thị đúng tiếng Việt.