const express = require('express');
const cors = require('cors');                    // THÊM DÒNG NÀY
const { poolPromise, sql } = require('./db.config');

const app = express();
const PORT = process.env.PORT || 3000;

// CHO PHÉP TẤT CẢ DOMAIN (dùng cho dev)
app.use(cors());                                 // THÊM DÒNG NÀY – CHO PHÉP TẤT CẢ

// Nếu bạn muốn chỉ cho phép domain cụ thể (ví dụ React chạy ở port 5173)
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5500'],
//     credentials: true
// }));

app.use(express.json());

// ================== CÁC API CỦA BẠN ==================
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

app.get('/', (req, res) => {
    res.send(`
        <h2>API FMSTYLE đang chạy!</h2>
        <p>→ <a href="/api/phongban">GET /api/phongban</a> để xem danh sách phòng ban</p>
    `);
});

app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
    console.log(`CORS đã được bật – bạn có thể gọi API từ bất kỳ đâu!`);
});