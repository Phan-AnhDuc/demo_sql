CREATE DATABASE HeThongQuanLyCuaHang_FMSTYLE;
GO

USE HeThongQuanLyCuaHang_FMSTYLE;
GO
create table LICHSUTHEODOINV(
	maLS nvarchar(10) not null,
	thang tinyint  CHECK (thang BETWEEN 1 AND 12),
    nam smallint  CHECK (nam BETWEEN 1900 AND 2100), 
	constraint pkLS primary key (maLS)
);

Create table PHONGBAN (
	maPB nvarchar(10) not null,
	tenPB nvarchar(40) not null,
Constraint pkPB primary key(maPB)
);

Create table VITRI (
	maVT nvarchar(10) not null,
	tenVT nvarchar(40) not null,
	Constraint pkVT primary key(maVT)
);

create table NHACUNGCAP(
	maNCC nvarchar (10) not null,
	tenNCC nvarchar(50) NOT NULL,
    diachi nvarchar(50),
    sdt varchar(10),
    email varchar(50),
	constraint pkNCC primary key(maNCC)
);
CREATE TABLE PHANLOAI_KH(
    maPLKH nvarchar(10) NOT NULL,
    tenPLKH nvarchar(40) NOT NULL,
    tongchi money,
    diemtichluy int CHECK(diemtichluy >= 0),
    CONSTRAINT pkPLKH PRIMARY KEY(maPLKH),
);

CREATE TABLE KHACHHANG(
    maKH nvarchar(10) NOT NULL,
    tenKH nvarchar(40) NOT NULL,
    maPLKH nvarchar(10) NOT NULL,
    diachi Nvarchar(50) NULL,
    sdt varchar(10) NULL,
    CONSTRAINT pkKH PRIMARY KEY(maKH),
    CONSTRAINT fkKH_PLKH  foreign key (maPLKH)
        REFERENCES PHANLOAI_KH (maPLKH)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
Create table NHANVIEN(
	maNV nvarchar(10) not null,
	tenNV nvarchar(40) not null,
	diachi nvarchar(50),
	sdt varchar(10),
	gioitinh bit,
	luong decimal(18,2) CHECK(luong >= 0),
    namsinh int CHECK(namsinh BETWEEN 1900 AND 2100),
	ngaylamviec date,
	maPB nvarchar(10) not null,
	maVT nvarchar(10) not null,
	Constraint pkNV primary key(maNV),

	Constraint fkNHANVIEN_VT foreign key(maVT)
		References VITRI(maVT)
		On delete cascade
		On update cascade,

	Constraint fkNHANVIEN_PB foreign key(maPB)
		References PHONGBAN(maPB)
		On delete cascade
		On update cascade
);
Create table PHIEUTHEODOINV (
    maLS nvarchar(10) not null,
    maNV nvarchar(10) not null,
    ngaylam date null,
    ngaynghi date null,
    tongngaylam int NULL CHECK(tongngaylam >= 0),
    tongngaynghi int NULL CHECK(tongngaynghi >= 0),
    ngaytangca date null,
    constraint pk_PTDNV primary key( maLS, maNV),
    Constraint fk_PT_maLS FOREIGN KEY (maLS)
        references LICHSUTHEODOINV(maLS)
        on delete cascade
        on update cascade,

    Constraint fk_PT_maNV FOREIGN KEY (maNV)
        references NHANVIEN(maNV)
        on delete cascade
        on update cascade
);

Create table HANGHOA(
	maHang nvarchar(10) not null,
	loaihang nvarchar(40) not null,
	soluong int NOT NULL CHECK(soluong >= 0),
	ngaynhaphang date,
	donvi nvarchar(20),
    maNCC nvarchar(10) NOT NULL,
    gianhapvao decimal(18,2) NOT NULL CHECK(gianhapvao >= 0),
    giabanra decimal(18,2) NOT NULL CHECK(giabanra >= 0),
	Constraint pkHH primary key(maHang),
	Constraint fkHH_NCC foreign key(maNCC)
		references NHACUNGCAP(maNCC)
        on delete cascade
		on update cascade
);
create table PHIEUNHAP(
	maPN nvarchar (10) not null,
	maNCC nvarchar (10) not null,
	ngaynhap date null,
	maNV nvarchar (10) not null,
	constraint pkPN primary key (maPN),

	constraint fkPHIEUNHAP_NV foreign key (maNV)
		references NHANVIEN(maNV)
		on delete cascade
		on update cascade,
	constraint fkPHIEUNHAP_NCC foreign key (maNCC)
		references NHACUNGCAP(maNCC)
		on delete cascade
		on update cascade
);
CREATE TABLE CHITIETPHIEUNHAP(
    maPN nvarchar(10) NOT NULL,
    maHang nvarchar(10) NOT NULL,
    soluongnhap int CHECK(soluongnhap >= 0),
    CONSTRAINT pk_CTPN primary key (maPN, maHang),
    CONSTRAINT fkCT_PN FOREIGN KEY(maPN)
        REFERENCES PHIEUNHAP(maPN)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkCT_HH FOREIGN KEY(maHang)
        REFERENCES HANGHOA(maHang)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

CREATE TABLE HOADON(
    maHD nvarchar(10) NOT NULL,
    maNV nvarchar(10) NOT NULL,
    ngaylap date NOT NULL,
    tongtien decimal(18,2) CHECK(tongtien >= 0),
    constraint pkHD primary key (maHD),
    CONSTRAINT fkHD_NV FOREIGN KEY(maNV)
        REFERENCES NHANVIEN(maNV)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
CREATE TABLE CHITIET_HD(
    maHD nvarchar(10) NOT NULL,
    maHang nvarchar(10) NOT NULL,
    soluong int CHECK(soluong >= 0),
    dongia decimal(18,2) CHECK(dongia >= 0),
    chietkhau int CHECK(chietkhau >= 0),
    tongtien decimal(18,2) CHECK(tongtien >= 0),
    CONSTRAINT pk_CTHD primary key (maHD, maHang),
    CONSTRAINT fkCTHD_HD FOREIGN KEY(maHD)
        REFERENCES HOADON(maHD)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkCTHD_HH FOREIGN KEY(maHang)
        REFERENCES HANGHOA(maHang)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

