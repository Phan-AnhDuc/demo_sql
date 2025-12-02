const express = require('express');
const cors = require('cors');
const { poolPromise, sql } = require('./db.config');

const app = express();
const PORT = process.env.PORT || 3000;

// CHO PHÉP TẤT CẢ DOMAIN (dùng cho dev)
app.use(cors());
app.use(express.json());

// ================== PHONGBAN APIs ==================
// GET all
app.get('/api/phongban', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maPB, tenPB FROM PHONGBAN ORDER BY tenPB');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu phòng ban',
            error: err.message
        });
    }
});

// GET by ID
app.get('/api/phongban/:maPB', async (req, res) => {
    const { maPB } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPB', sql.NVarChar(10), maPB)
            .query('SELECT maPB, tenPB FROM PHONGBAN WHERE maPB = @maPB');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phòng ban'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/phongban', async (req, res) => {
    const { maPB, tenPB } = req.body;
    if (!maPB || !tenPB) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maPB hoặc tenPB'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maPB', sql.NVarChar(10), maPB)
            .input('tenPB', sql.NVarChar(40), tenPB)
            .query('INSERT INTO PHONGBAN (maPB, tenPB) VALUES (@maPB, @tenPB)');

        res.status(201).json({
            success: true,
            message: 'Thêm phòng ban thành công',
            data: { maPB, tenPB }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm phòng ban',
            error: err.message
        });
    }
});

// PUT
app.put('/api/phongban/:maPB', async (req, res) => {
    const { maPB } = req.params;
    const { tenPB } = req.body;
    if (!tenPB) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin tenPB'
        });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPB', sql.NVarChar(10), maPB)
            .input('tenPB', sql.NVarChar(40), tenPB)
            .query('UPDATE PHONGBAN SET tenPB = @tenPB WHERE maPB = @maPB');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phòng ban'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật phòng ban thành công',
            data: { maPB, tenPB }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật phòng ban',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/phongban/:maPB', async (req, res) => {
    const { maPB } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPB', sql.NVarChar(10), maPB)
            .query('DELETE FROM PHONGBAN WHERE maPB = @maPB');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phòng ban'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa phòng ban thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa phòng ban',
            error: err.message
        });
    }
});

// ================== VITRI APIs ==================
// GET all
app.get('/api/vitri', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maVT, tenVT FROM VITRI ORDER BY tenVT');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu vị trí',
            error: err.message
        });
    }
});

// GET by ID
app.get('/api/vitri/:maVT', async (req, res) => {
    const { maVT } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maVT', sql.NVarChar(10), maVT)
            .query('SELECT maVT, tenVT FROM VITRI WHERE maVT = @maVT');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy vị trí'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/vitri', async (req, res) => {
    const { maVT, tenVT } = req.body;
    if (!maVT || !tenVT) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maVT hoặc tenVT'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maVT', sql.NVarChar(10), maVT)
            .input('tenVT', sql.NVarChar(40), tenVT)
            .query('INSERT INTO VITRI (maVT, tenVT) VALUES (@maVT, @tenVT)');

        res.status(201).json({
            success: true,
            message: 'Thêm vị trí thành công',
            data: { maVT, tenVT }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm vị trí',
            error: err.message
        });
    }
});

// PUT
app.put('/api/vitri/:maVT', async (req, res) => {
    const { maVT } = req.params;
    const { tenVT } = req.body;
    if (!tenVT) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin tenVT'
        });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maVT', sql.NVarChar(10), maVT)
            .input('tenVT', sql.NVarChar(40), tenVT)
            .query('UPDATE VITRI SET tenVT = @tenVT WHERE maVT = @maVT');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy vị trí'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật vị trí thành công',
            data: { maVT, tenVT }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật vị trí',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/vitri/:maVT', async (req, res) => {
    const { maVT } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maVT', sql.NVarChar(10), maVT)
            .query('DELETE FROM VITRI WHERE maVT = @maVT');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy vị trí'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa vị trí thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa vị trí',
            error: err.message
        });
    }
});

// ================== NHACUNGCAP APIs ==================
// GET all
app.get('/api/nhacungcap', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maNCC, tenNCC, diachi, sdt, email FROM NHACUNGCAP ORDER BY tenNCC');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu nhà cung cấp',
            error: err.message
        });
    }
});

// GET by ID
app.get('/api/nhacungcap/:maNCC', async (req, res) => {
    const { maNCC } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maNCC', sql.NVarChar(10), maNCC)
            .query('SELECT maNCC, tenNCC, diachi, sdt, email FROM NHACUNGCAP WHERE maNCC = @maNCC');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà cung cấp'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/nhacungcap', async (req, res) => {
    const { maNCC, tenNCC, diachi, sdt, email } = req.body;
    if (!maNCC || !tenNCC) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maNCC hoặc tenNCC'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maNCC', sql.NVarChar(10), maNCC)
            .input('tenNCC', sql.NVarChar(50), tenNCC)
            .input('diachi', sql.NVarChar(50), diachi || null)
            .input('sdt', sql.VarChar(10), sdt || null)
            .input('email', sql.VarChar(50), email || null)
            .query('INSERT INTO NHACUNGCAP (maNCC, tenNCC, diachi, sdt, email) VALUES (@maNCC, @tenNCC, @diachi, @sdt, @email)');

        res.status(201).json({
            success: true,
            message: 'Thêm nhà cung cấp thành công',
            data: { maNCC, tenNCC, diachi, sdt, email }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm nhà cung cấp',
            error: err.message
        });
    }
});

// PUT
app.put('/api/nhacungcap/:maNCC', async (req, res) => {
    const { maNCC } = req.params;
    const { tenNCC, diachi, sdt, email } = req.body;
    if (!tenNCC) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin tenNCC'
        });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maNCC', sql.NVarChar(10), maNCC)
            .input('tenNCC', sql.NVarChar(50), tenNCC)
            .input('diachi', sql.NVarChar(50), diachi || null)
            .input('sdt', sql.VarChar(10), sdt || null)
            .input('email', sql.VarChar(50), email || null)
            .query('UPDATE NHACUNGCAP SET tenNCC = @tenNCC, diachi = @diachi, sdt = @sdt, email = @email WHERE maNCC = @maNCC');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà cung cấp'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật nhà cung cấp thành công',
            data: { maNCC, tenNCC, diachi, sdt, email }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật nhà cung cấp',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/nhacungcap/:maNCC', async (req, res) => {
    const { maNCC } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maNCC', sql.NVarChar(10), maNCC)
            .query('DELETE FROM NHACUNGCAP WHERE maNCC = @maNCC');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà cung cấp'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa nhà cung cấp thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa nhà cung cấp',
            error: err.message
        });
    }
});

// ================== PHANLOAI_KH APIs ==================
// GET all
app.get('/api/phanloaikh', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maPLKH, tenPLKH, tongchi, diemtichluy FROM PHANLOAI_KH ORDER BY tenPLKH');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu phân loại khách hàng',
            error: err.message
        });
    }
});

// GET by ID
app.get('/api/phanloaikh/:maPLKH', async (req, res) => {
    const { maPLKH } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPLKH', sql.NVarChar(10), maPLKH)
            .query('SELECT maPLKH, tenPLKH, tongchi, diemtichluy FROM PHANLOAI_KH WHERE maPLKH = @maPLKH');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phân loại khách hàng'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/phanloaikh', async (req, res) => {
    const { maPLKH, tenPLKH, tongchi, diemtichluy } = req.body;
    if (!maPLKH || !tenPLKH) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maPLKH hoặc tenPLKH'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maPLKH', sql.NVarChar(10), maPLKH)
            .input('tenPLKH', sql.NVarChar(40), tenPLKH)
            .input('tongchi', sql.Money, tongchi || null)
            .input('diemtichluy', sql.Int, diemtichluy || null)
            .query('INSERT INTO PHANLOAI_KH (maPLKH, tenPLKH, tongchi, diemtichluy) VALUES (@maPLKH, @tenPLKH, @tongchi, @diemtichluy)');

        res.status(201).json({
            success: true,
            message: 'Thêm phân loại khách hàng thành công',
            data: { maPLKH, tenPLKH, tongchi, diemtichluy }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm phân loại khách hàng',
            error: err.message
        });
    }
});

// PUT
app.put('/api/phanloaikh/:maPLKH', async (req, res) => {
    const { maPLKH } = req.params;
    const { tenPLKH, tongchi, diemtichluy } = req.body;
    if (!tenPLKH) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin tenPLKH'
        });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPLKH', sql.NVarChar(10), maPLKH)
            .input('tenPLKH', sql.NVarChar(40), tenPLKH)
            .input('tongchi', sql.Money, tongchi || null)
            .input('diemtichluy', sql.Int, diemtichluy || null)
            .query('UPDATE PHANLOAI_KH SET tenPLKH = @tenPLKH, tongchi = @tongchi, diemtichluy = @diemtichluy WHERE maPLKH = @maPLKH');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phân loại khách hàng'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật phân loại khách hàng thành công',
            data: { maPLKH, tenPLKH, tongchi, diemtichluy }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật phân loại khách hàng',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/phanloaikh/:maPLKH', async (req, res) => {
    const { maPLKH } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPLKH', sql.NVarChar(10), maPLKH)
            .query('DELETE FROM PHANLOAI_KH WHERE maPLKH = @maPLKH');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phân loại khách hàng'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa phân loại khách hàng thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa phân loại khách hàng',
            error: err.message
        });
    }
});

// ================== KHACHHANG APIs ==================
// GET all
app.get('/api/khachhang', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maKH, tenKH, maPLKH, diachi, sdt FROM KHACHHANG ORDER BY tenKH');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu khách hàng',
            error: err.message
        });
    }
});

// GET by ID
app.get('/api/khachhang/:maKH', async (req, res) => {
    const { maKH } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maKH', sql.NVarChar(10), maKH)
            .query('SELECT maKH, tenKH, maPLKH, diachi, sdt FROM KHACHHANG WHERE maKH = @maKH');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy khách hàng'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/khachhang', async (req, res) => {
    const { maKH, tenKH, maPLKH, diachi, sdt } = req.body;
    if (!maKH || !tenKH || !maPLKH) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maKH, tenKH hoặc maPLKH'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maKH', sql.NVarChar(10), maKH)
            .input('tenKH', sql.NVarChar(40), tenKH)
            .input('maPLKH', sql.NVarChar(10), maPLKH)
            .input('diachi', sql.NVarChar(50), diachi || null)
            .input('sdt', sql.VarChar(10), sdt || null)
            .query('INSERT INTO KHACHHANG (maKH, tenKH, maPLKH, diachi, sdt) VALUES (@maKH, @tenKH, @maPLKH, @diachi, @sdt)');

        res.status(201).json({
            success: true,
            message: 'Thêm khách hàng thành công',
            data: { maKH, tenKH, maPLKH, diachi, sdt }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm khách hàng',
            error: err.message
        });
    }
});

// PUT
app.put('/api/khachhang/:maKH', async (req, res) => {
    const { maKH } = req.params;
    const { tenKH, maPLKH, diachi, sdt } = req.body;
    if (!tenKH || !maPLKH) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin tenKH hoặc maPLKH'
        });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maKH', sql.NVarChar(10), maKH)
            .input('tenKH', sql.NVarChar(40), tenKH)
            .input('maPLKH', sql.NVarChar(10), maPLKH)
            .input('diachi', sql.NVarChar(50), diachi || null)
            .input('sdt', sql.VarChar(10), sdt || null)
            .query('UPDATE KHACHHANG SET tenKH = @tenKH, maPLKH = @maPLKH, diachi = @diachi, sdt = @sdt WHERE maKH = @maKH');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy khách hàng'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật khách hàng thành công',
            data: { maKH, tenKH, maPLKH, diachi, sdt }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật khách hàng',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/khachhang/:maKH', async (req, res) => {
    const { maKH } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maKH', sql.NVarChar(10), maKH)
            .query('DELETE FROM KHACHHANG WHERE maKH = @maKH');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy khách hàng'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa khách hàng thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa khách hàng',
            error: err.message
        });
    }
});

// ================== NHANVIEN APIs ==================
// GET all
app.get('/api/nhanvien', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maNV, tenNV, diachi, sdt, gioitinh, luong, namsinh, ngaylamviec, maPB, maVT FROM NHANVIEN ORDER BY tenNV');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu nhân viên',
            error: err.message
        });
    }
});

// GET by ID
app.get('/api/nhanvien/:maNV', async (req, res) => {
    const { maNV } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maNV', sql.NVarChar(10), maNV)
            .query('SELECT maNV, tenNV, diachi, sdt, gioitinh, luong, namsinh, ngaylamviec, maPB, maVT FROM NHANVIEN WHERE maNV = @maNV');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhân viên'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/nhanvien', async (req, res) => {
    const { maNV, tenNV, diachi, sdt, gioitinh, luong, namsinh, ngaylamviec, maPB, maVT } = req.body;
    if (!maNV || !tenNV || !maPB || !maVT) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc: maNV, tenNV, maPB, maVT'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maNV', sql.NVarChar(10), maNV)
            .input('tenNV', sql.NVarChar(40), tenNV)
            .input('diachi', sql.NVarChar(50), diachi || null)
            .input('sdt', sql.VarChar(10), sdt || null)
            .input('gioitinh', sql.Bit, gioitinh !== undefined ? gioitinh : null)
            .input('luong', sql.Decimal(18, 2), luong || null)
            .input('namsinh', sql.Int, namsinh || null)
            .input('ngaylamviec', sql.Date, ngaylamviec || null)
            .input('maPB', sql.NVarChar(10), maPB)
            .input('maVT', sql.NVarChar(10), maVT)
            .query('INSERT INTO NHANVIEN (maNV, tenNV, diachi, sdt, gioitinh, luong, namsinh, ngaylamviec, maPB, maVT) VALUES (@maNV, @tenNV, @diachi, @sdt, @gioitinh, @luong, @namsinh, @ngaylamviec, @maPB, @maVT)');

        res.status(201).json({
            success: true,
            message: 'Thêm nhân viên thành công',
            data: { maNV, tenNV, diachi, sdt, gioitinh, luong, namsinh, ngaylamviec, maPB, maVT }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm nhân viên',
            error: err.message
        });
    }
});

// PUT
app.put('/api/nhanvien/:maNV', async (req, res) => {
    const { maNV } = req.params;
    const { tenNV, diachi, sdt, gioitinh, luong, namsinh, ngaylamviec, maPB, maVT } = req.body;
    if (!tenNV || !maPB || !maVT) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc: tenNV, maPB, maVT'
        });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maNV', sql.NVarChar(10), maNV)
            .input('tenNV', sql.NVarChar(40), tenNV)
            .input('diachi', sql.NVarChar(50), diachi || null)
            .input('sdt', sql.VarChar(10), sdt || null)
            .input('gioitinh', sql.Bit, gioitinh !== undefined ? gioitinh : null)
            .input('luong', sql.Decimal(18, 2), luong || null)
            .input('namsinh', sql.Int, namsinh || null)
            .input('ngaylamviec', sql.Date, ngaylamviec || null)
            .input('maPB', sql.NVarChar(10), maPB)
            .input('maVT', sql.NVarChar(10), maVT)
            .query('UPDATE NHANVIEN SET tenNV = @tenNV, diachi = @diachi, sdt = @sdt, gioitinh = @gioitinh, luong = @luong, namsinh = @namsinh, ngaylamviec = @ngaylamviec, maPB = @maPB, maVT = @maVT WHERE maNV = @maNV');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhân viên'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật nhân viên thành công',
            data: { maNV, tenNV, diachi, sdt, gioitinh, luong, namsinh, ngaylamviec, maPB, maVT }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật nhân viên',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/nhanvien/:maNV', async (req, res) => {
    const { maNV } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maNV', sql.NVarChar(10), maNV)
            .query('DELETE FROM NHANVIEN WHERE maNV = @maNV');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhân viên'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa nhân viên thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa nhân viên',
            error: err.message
        });
    }
});

// ================== LICHSUTHEODOINV APIs ==================
// GET all
app.get('/api/lichsutheodoinv', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maLS, thang, nam FROM LICHSUTHEODOINV ORDER BY nam DESC, thang DESC');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu lịch sử theo dõi nhân viên',
            error: err.message
        });
    }
});

// GET by ID
app.get('/api/lichsutheodoinv/:maLS', async (req, res) => {
    const { maLS } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maLS', sql.NVarChar(10), maLS)
            .query('SELECT maLS, thang, nam FROM LICHSUTHEODOINV WHERE maLS = @maLS');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch sử theo dõi'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/lichsutheodoinv', async (req, res) => {
    const { maLS, thang, nam } = req.body;
    if (!maLS) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maLS'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maLS', sql.NVarChar(10), maLS)
            .input('thang', sql.TinyInt, thang || null)
            .input('nam', sql.SmallInt, nam || null)
            .query('INSERT INTO LICHSUTHEODOINV (maLS, thang, nam) VALUES (@maLS, @thang, @nam)');

        res.status(201).json({
            success: true,
            message: 'Thêm lịch sử theo dõi thành công',
            data: { maLS, thang, nam }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm lịch sử theo dõi',
            error: err.message
        });
    }
});

// PUT
app.put('/api/lichsutheodoinv/:maLS', async (req, res) => {
    const { maLS } = req.params;
    const { thang, nam } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maLS', sql.NVarChar(10), maLS)
            .input('thang', sql.TinyInt, thang || null)
            .input('nam', sql.SmallInt, nam || null)
            .query('UPDATE LICHSUTHEODOINV SET thang = @thang, nam = @nam WHERE maLS = @maLS');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch sử theo dõi'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật lịch sử theo dõi thành công',
            data: { maLS, thang, nam }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật lịch sử theo dõi',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/lichsutheodoinv/:maLS', async (req, res) => {
    const { maLS } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maLS', sql.NVarChar(10), maLS)
            .query('DELETE FROM LICHSUTHEODOINV WHERE maLS = @maLS');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch sử theo dõi'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa lịch sử theo dõi thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa lịch sử theo dõi',
            error: err.message
        });
    }
});

// ================== PHIEUTHEODOINV APIs ==================
// GET all
app.get('/api/phieutheodoinv', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maLS, maNV, ngaylam, ngaynghi, tongngaylam, tongngaynghi, ngaytangca FROM PHIEUTHEODOINV');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu phiếu theo dõi nhân viên',
            error: err.message
        });
    }
});

// GET by ID (composite key)
app.get('/api/phieutheodoinv/:maLS/:maNV', async (req, res) => {
    const { maLS, maNV } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maLS', sql.NVarChar(10), maLS)
            .input('maNV', sql.NVarChar(10), maNV)
            .query('SELECT maLS, maNV, ngaylam, ngaynghi, tongngaylam, tongngaynghi, ngaytangca FROM PHIEUTHEODOINV WHERE maLS = @maLS AND maNV = @maNV');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu theo dõi'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/phieutheodoinv', async (req, res) => {
    const { maLS, maNV, ngaylam, ngaynghi, tongngaylam, tongngaynghi, ngaytangca } = req.body;
    if (!maLS || !maNV) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maLS hoặc maNV'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maLS', sql.NVarChar(10), maLS)
            .input('maNV', sql.NVarChar(10), maNV)
            .input('ngaylam', sql.Date, ngaylam || null)
            .input('ngaynghi', sql.Date, ngaynghi || null)
            .input('tongngaylam', sql.Int, tongngaylam || null)
            .input('tongngaynghi', sql.Int, tongngaynghi || null)
            .input('ngaytangca', sql.Date, ngaytangca || null)
            .query('INSERT INTO PHIEUTHEODOINV (maLS, maNV, ngaylam, ngaynghi, tongngaylam, tongngaynghi, ngaytangca) VALUES (@maLS, @maNV, @ngaylam, @ngaynghi, @tongngaylam, @tongngaynghi, @ngaytangca)');

        res.status(201).json({
            success: true,
            message: 'Thêm phiếu theo dõi thành công',
            data: { maLS, maNV, ngaylam, ngaynghi, tongngaylam, tongngaynghi, ngaytangca }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm phiếu theo dõi',
            error: err.message
        });
    }
});

// PUT
app.put('/api/phieutheodoinv/:maLS/:maNV', async (req, res) => {
    const { maLS, maNV } = req.params;
    const { ngaylam, ngaynghi, tongngaylam, tongngaynghi, ngaytangca } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maLS', sql.NVarChar(10), maLS)
            .input('maNV', sql.NVarChar(10), maNV)
            .input('ngaylam', sql.Date, ngaylam || null)
            .input('ngaynghi', sql.Date, ngaynghi || null)
            .input('tongngaylam', sql.Int, tongngaylam || null)
            .input('tongngaynghi', sql.Int, tongngaynghi || null)
            .input('ngaytangca', sql.Date, ngaytangca || null)
            .query('UPDATE PHIEUTHEODOINV SET ngaylam = @ngaylam, ngaynghi = @ngaynghi, tongngaylam = @tongngaylam, tongngaynghi = @tongngaynghi, ngaytangca = @ngaytangca WHERE maLS = @maLS AND maNV = @maNV');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu theo dõi'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật phiếu theo dõi thành công',
            data: { maLS, maNV, ngaylam, ngaynghi, tongngaylam, tongngaynghi, ngaytangca }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật phiếu theo dõi',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/phieutheodoinv/:maLS/:maNV', async (req, res) => {
    const { maLS, maNV } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maLS', sql.NVarChar(10), maLS)
            .input('maNV', sql.NVarChar(10), maNV)
            .query('DELETE FROM PHIEUTHEODOINV WHERE maLS = @maLS AND maNV = @maNV');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu theo dõi'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa phiếu theo dõi thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa phiếu theo dõi',
            error: err.message
        });
    }
});

// ================== HANGHOA APIs ==================
// GET all
app.get('/api/hanghoa', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maHang, loaihang, soluong, ngaynhaphang, donvi, maNCC, gianhapvao, giabanra FROM HANGHOA ORDER BY loaihang');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu hàng hóa',
            error: err.message
        });
    }
});

// GET by ID
app.get('/api/hanghoa/:maHang', async (req, res) => {
    const { maHang } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maHang', sql.NVarChar(10), maHang)
            .query('SELECT maHang, loaihang, soluong, ngaynhaphang, donvi, maNCC, gianhapvao, giabanra FROM HANGHOA WHERE maHang = @maHang');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hàng hóa'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/hanghoa', async (req, res) => {
    const { maHang, loaihang, soluong, ngaynhaphang, donvi, maNCC, gianhapvao, giabanra } = req.body;
    if (!maHang || !loaihang || soluong === undefined || !maNCC || gianhapvao === undefined || giabanra === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maHang', sql.NVarChar(10), maHang)
            .input('loaihang', sql.NVarChar(40), loaihang)
            .input('soluong', sql.Int, soluong)
            .input('ngaynhaphang', sql.Date, ngaynhaphang || null)
            .input('donvi', sql.NVarChar(20), donvi || null)
            .input('maNCC', sql.NVarChar(10), maNCC)
            .input('gianhapvao', sql.Decimal(18, 2), gianhapvao)
            .input('giabanra', sql.Decimal(18, 2), giabanra)
            .query('INSERT INTO HANGHOA (maHang, loaihang, soluong, ngaynhaphang, donvi, maNCC, gianhapvao, giabanra) VALUES (@maHang, @loaihang, @soluong, @ngaynhaphang, @donvi, @maNCC, @gianhapvao, @giabanra)');

        res.status(201).json({
            success: true,
            message: 'Thêm hàng hóa thành công',
            data: { maHang, loaihang, soluong, ngaynhaphang, donvi, maNCC, gianhapvao, giabanra }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm hàng hóa',
            error: err.message
        });
    }
});

// PUT
app.put('/api/hanghoa/:maHang', async (req, res) => {
    const { maHang } = req.params;
    const { loaihang, soluong, ngaynhaphang, donvi, maNCC, gianhapvao, giabanra } = req.body;
    if (!loaihang || soluong === undefined || !maNCC || gianhapvao === undefined || giabanra === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc'
        });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maHang', sql.NVarChar(10), maHang)
            .input('loaihang', sql.NVarChar(40), loaihang)
            .input('soluong', sql.Int, soluong)
            .input('ngaynhaphang', sql.Date, ngaynhaphang || null)
            .input('donvi', sql.NVarChar(20), donvi || null)
            .input('maNCC', sql.NVarChar(10), maNCC)
            .input('gianhapvao', sql.Decimal(18, 2), gianhapvao)
            .input('giabanra', sql.Decimal(18, 2), giabanra)
            .query('UPDATE HANGHOA SET loaihang = @loaihang, soluong = @soluong, ngaynhaphang = @ngaynhaphang, donvi = @donvi, maNCC = @maNCC, gianhapvao = @gianhapvao, giabanra = @giabanra WHERE maHang = @maHang');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hàng hóa'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật hàng hóa thành công',
            data: { maHang, loaihang, soluong, ngaynhaphang, donvi, maNCC, gianhapvao, giabanra }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật hàng hóa',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/hanghoa/:maHang', async (req, res) => {
    const { maHang } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maHang', sql.NVarChar(10), maHang)
            .query('DELETE FROM HANGHOA WHERE maHang = @maHang');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hàng hóa'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa hàng hóa thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa hàng hóa',
            error: err.message
        });
    }
});

// ================== PHIEUNHAP APIs ==================
// GET all
app.get('/api/phieunhap', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maPN, maNCC, ngaynhap, maNV FROM PHIEUNHAP ORDER BY ngaynhap DESC');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu phiếu nhập',
            error: err.message
        });
    }
});

// GET by ID
app.get('/api/phieunhap/:maPN', async (req, res) => {
    const { maPN } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPN', sql.NVarChar(10), maPN)
            .query('SELECT maPN, maNCC, ngaynhap, maNV FROM PHIEUNHAP WHERE maPN = @maPN');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu nhập'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/phieunhap', async (req, res) => {
    const { maPN, maNCC, ngaynhap, maNV } = req.body;
    if (!maPN || !maNCC || !maNV) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maPN, maNCC hoặc maNV'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maPN', sql.NVarChar(10), maPN)
            .input('maNCC', sql.NVarChar(10), maNCC)
            .input('ngaynhap', sql.Date, ngaynhap || null)
            .input('maNV', sql.NVarChar(10), maNV)
            .query('INSERT INTO PHIEUNHAP (maPN, maNCC, ngaynhap, maNV) VALUES (@maPN, @maNCC, @ngaynhap, @maNV)');

        res.status(201).json({
            success: true,
            message: 'Thêm phiếu nhập thành công',
            data: { maPN, maNCC, ngaynhap, maNV }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm phiếu nhập',
            error: err.message
        });
    }
});

// PUT
app.put('/api/phieunhap/:maPN', async (req, res) => {
    const { maPN } = req.params;
    const { maNCC, ngaynhap, maNV } = req.body;
    if (!maNCC || !maNV) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maNCC hoặc maNV'
        });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPN', sql.NVarChar(10), maPN)
            .input('maNCC', sql.NVarChar(10), maNCC)
            .input('ngaynhap', sql.Date, ngaynhap || null)
            .input('maNV', sql.NVarChar(10), maNV)
            .query('UPDATE PHIEUNHAP SET maNCC = @maNCC, ngaynhap = @ngaynhap, maNV = @maNV WHERE maPN = @maPN');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu nhập'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật phiếu nhập thành công',
            data: { maPN, maNCC, ngaynhap, maNV }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật phiếu nhập',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/phieunhap/:maPN', async (req, res) => {
    const { maPN } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPN', sql.NVarChar(10), maPN)
            .query('DELETE FROM PHIEUNHAP WHERE maPN = @maPN');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu nhập'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa phiếu nhập thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa phiếu nhập',
            error: err.message
        });
    }
});

// ================== CHITIETPHIEUNHAP APIs ==================
// GET all
app.get('/api/chitietphieunhap', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maPN, maHang, soluongnhap FROM CHITIETPHIEUNHAP');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu chi tiết phiếu nhập',
            error: err.message
        });
    }
});

// GET by ID (composite key)
app.get('/api/chitietphieunhap/:maPN/:maHang', async (req, res) => {
    const { maPN, maHang } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPN', sql.NVarChar(10), maPN)
            .input('maHang', sql.NVarChar(10), maHang)
            .query('SELECT maPN, maHang, soluongnhap FROM CHITIETPHIEUNHAP WHERE maPN = @maPN AND maHang = @maHang');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chi tiết phiếu nhập'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// GET by maPN
app.get('/api/chitietphieunhap/:maPN', async (req, res) => {
    const { maPN } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPN', sql.NVarChar(10), maPN)
            .query('SELECT maPN, maHang, soluongnhap FROM CHITIETPHIEUNHAP WHERE maPN = @maPN');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/chitietphieunhap', async (req, res) => {
    const { maPN, maHang, soluongnhap } = req.body;
    if (!maPN || !maHang || soluongnhap === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maPN, maHang hoặc soluongnhap'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maPN', sql.NVarChar(10), maPN)
            .input('maHang', sql.NVarChar(10), maHang)
            .input('soluongnhap', sql.Int, soluongnhap)
            .query('INSERT INTO CHITIETPHIEUNHAP (maPN, maHang, soluongnhap) VALUES (@maPN, @maHang, @soluongnhap)');

        res.status(201).json({
            success: true,
            message: 'Thêm chi tiết phiếu nhập thành công',
            data: { maPN, maHang, soluongnhap }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm chi tiết phiếu nhập',
            error: err.message
        });
    }
});

// PUT
app.put('/api/chitietphieunhap/:maPN/:maHang', async (req, res) => {
    const { maPN, maHang } = req.params;
    const { soluongnhap } = req.body;
    if (soluongnhap === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin soluongnhap'
        });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPN', sql.NVarChar(10), maPN)
            .input('maHang', sql.NVarChar(10), maHang)
            .input('soluongnhap', sql.Int, soluongnhap)
            .query('UPDATE CHITIETPHIEUNHAP SET soluongnhap = @soluongnhap WHERE maPN = @maPN AND maHang = @maHang');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chi tiết phiếu nhập'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật chi tiết phiếu nhập thành công',
            data: { maPN, maHang, soluongnhap }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật chi tiết phiếu nhập',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/chitietphieunhap/:maPN/:maHang', async (req, res) => {
    const { maPN, maHang } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maPN', sql.NVarChar(10), maPN)
            .input('maHang', sql.NVarChar(10), maHang)
            .query('DELETE FROM CHITIETPHIEUNHAP WHERE maPN = @maPN AND maHang = @maHang');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chi tiết phiếu nhập'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa chi tiết phiếu nhập thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa chi tiết phiếu nhập',
            error: err.message
        });
    }
});

// ================== HOADON APIs ==================
// GET all
app.get('/api/hoadon', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maHD, maNV, ngaylap, tongtien FROM HOADON ORDER BY ngaylap DESC');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu hóa đơn',
            error: err.message
        });
    }
});

// GET by ID
app.get('/api/hoadon/:maHD', async (req, res) => {
    const { maHD } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maHD', sql.NVarChar(10), maHD)
            .query('SELECT maHD, maNV, ngaylap, tongtien FROM HOADON WHERE maHD = @maHD');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hóa đơn'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/hoadon', async (req, res) => {
    const { maHD, maNV, ngaylap, tongtien } = req.body;
    if (!maHD || !maNV || !ngaylap) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maHD, maNV hoặc ngaylap'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maHD', sql.NVarChar(10), maHD)
            .input('maNV', sql.NVarChar(10), maNV)
            .input('ngaylap', sql.Date, ngaylap)
            .input('tongtien', sql.Decimal(18, 2), tongtien || null)
            .query('INSERT INTO HOADON (maHD, maNV, ngaylap, tongtien) VALUES (@maHD, @maNV, @ngaylap, @tongtien)');

        res.status(201).json({
            success: true,
            message: 'Thêm hóa đơn thành công',
            data: { maHD, maNV, ngaylap, tongtien }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm hóa đơn',
            error: err.message
        });
    }
});

// PUT
app.put('/api/hoadon/:maHD', async (req, res) => {
    const { maHD } = req.params;
    const { maNV, ngaylap, tongtien } = req.body;
    if (!maNV || !ngaylap) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin maNV hoặc ngaylap'
        });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maHD', sql.NVarChar(10), maHD)
            .input('maNV', sql.NVarChar(10), maNV)
            .input('ngaylap', sql.Date, ngaylap)
            .input('tongtien', sql.Decimal(18, 2), tongtien || null)
            .query('UPDATE HOADON SET maNV = @maNV, ngaylap = @ngaylap, tongtien = @tongtien WHERE maHD = @maHD');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hóa đơn'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật hóa đơn thành công',
            data: { maHD, maNV, ngaylap, tongtien }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật hóa đơn',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/hoadon/:maHD', async (req, res) => {
    const { maHD } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maHD', sql.NVarChar(10), maHD)
            .query('DELETE FROM HOADON WHERE maHD = @maHD');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hóa đơn'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa hóa đơn thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa hóa đơn',
            error: err.message
        });
    }
});

// ================== CHITIET_HD APIs ==================
// GET all
app.get('/api/chitiethd', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT maHD, maHang, soluong, dongia, chietkhau, tongtien FROM CHITIET_HD');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu chi tiết hóa đơn',
            error: err.message
        });
    }
});

// GET by ID (composite key)
app.get('/api/chitiethd/:maHD/:maHang', async (req, res) => {
    const { maHD, maHang } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maHD', sql.NVarChar(10), maHD)
            .input('maHang', sql.NVarChar(10), maHang)
            .query('SELECT maHD, maHang, soluong, dongia, chietkhau, tongtien FROM CHITIET_HD WHERE maHD = @maHD AND maHang = @maHang');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chi tiết hóa đơn'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// GET by maHD
app.get('/api/chitiethd/:maHD', async (req, res) => {
    const { maHD } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maHD', sql.NVarChar(10), maHD)
            .query('SELECT maHD, maHang, soluong, dongia, chietkhau, tongtien FROM CHITIET_HD WHERE maHD = @maHD');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
});

// POST
app.post('/api/chitiethd', async (req, res) => {
    const { maHD, maHang, soluong, dongia, chietkhau, tongtien } = req.body;
    if (!maHD || !maHang || soluong === undefined || dongia === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc: maHD, maHang, soluong, dongia'
        });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('maHD', sql.NVarChar(10), maHD)
            .input('maHang', sql.NVarChar(10), maHang)
            .input('soluong', sql.Int, soluong)
            .input('dongia', sql.Decimal(18, 2), dongia)
            .input('chietkhau', sql.Int, chietkhau || null)
            .input('tongtien', sql.Decimal(18, 2), tongtien || null)
            .query('INSERT INTO CHITIET_HD (maHD, maHang, soluong, dongia, chietkhau, tongtien) VALUES (@maHD, @maHang, @soluong, @dongia, @chietkhau, @tongtien)');

        res.status(201).json({
            success: true,
            message: 'Thêm chi tiết hóa đơn thành công',
            data: { maHD, maHang, soluong, dongia, chietkhau, tongtien }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm chi tiết hóa đơn',
            error: err.message
        });
    }
});

// PUT
app.put('/api/chitiethd/:maHD/:maHang', async (req, res) => {
    const { maHD, maHang } = req.params;
    const { soluong, dongia, chietkhau, tongtien } = req.body;
    if (soluong === undefined || dongia === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin soluong hoặc dongia'
        });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maHD', sql.NVarChar(10), maHD)
            .input('maHang', sql.NVarChar(10), maHang)
            .input('soluong', sql.Int, soluong)
            .input('dongia', sql.Decimal(18, 2), dongia)
            .input('chietkhau', sql.Int, chietkhau || null)
            .input('tongtien', sql.Decimal(18, 2), tongtien || null)
            .query('UPDATE CHITIET_HD SET soluong = @soluong, dongia = @dongia, chietkhau = @chietkhau, tongtien = @tongtien WHERE maHD = @maHD AND maHang = @maHang');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chi tiết hóa đơn'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật chi tiết hóa đơn thành công',
            data: { maHD, maHang, soluong, dongia, chietkhau, tongtien }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật chi tiết hóa đơn',
            error: err.message
        });
    }
});

// DELETE
app.delete('/api/chitiethd/:maHD/:maHang', async (req, res) => {
    const { maHD, maHang } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('maHD', sql.NVarChar(10), maHD)
            .input('maHang', sql.NVarChar(10), maHang)
            .query('DELETE FROM CHITIET_HD WHERE maHD = @maHD AND maHang = @maHang');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chi tiết hóa đơn'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa chi tiết hóa đơn thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa chi tiết hóa đơn',
            error: err.message
        });
    }
});

// ================== HOME PAGE ==================
app.get('/', (req, res) => {
    res.send(`
        <h2>API FMSTYLE đang chạy!</h2>
        <h3>Danh sách các API endpoints:</h3>
        <ul>
            <li><strong>PHONGBAN:</strong> GET, POST, PUT, DELETE /api/phongban</li>
            <li><strong>VITRI:</strong> GET, POST, PUT, DELETE /api/vitri</li>
            <li><strong>NHACUNGCAP:</strong> GET, POST, PUT, DELETE /api/nhacungcap</li>
            <li><strong>PHANLOAI_KH:</strong> GET, POST, PUT, DELETE /api/phanloaikh</li>
            <li><strong>KHACHHANG:</strong> GET, POST, PUT, DELETE /api/khachhang</li>
            <li><strong>NHANVIEN:</strong> GET, POST, PUT, DELETE /api/nhanvien</li>
            <li><strong>LICHSUTHEODOINV:</strong> GET, POST, PUT, DELETE /api/lichsutheodoinv</li>
            <li><strong>PHIEUTHEODOINV:</strong> GET, POST, PUT, DELETE /api/phieutheodoinv</li>
            <li><strong>HANGHOA:</strong> GET, POST, PUT, DELETE /api/hanghoa</li>
            <li><strong>PHIEUNHAP:</strong> GET, POST, PUT, DELETE /api/phieunhap</li>
            <li><strong>CHITIETPHIEUNHAP:</strong> GET, POST, PUT, DELETE /api/chitietphieunhap</li>
            <li><strong>HOADON:</strong> GET, POST, PUT, DELETE /api/hoadon</li>
            <li><strong>CHITIET_HD:</strong> GET, POST, PUT, DELETE /api/chitiethd</li>
        </ul>
    `);
});

app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
    console.log(`CORS đã được bật – bạn có thể gọi API từ bất kỳ đâu!`);
});
