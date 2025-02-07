const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// ตรวจสอบผู้ใช้ (ตัวอย่างง่ายๆ)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "1234") {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// อัปโหลดไฟล์
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'อัปโหลดไฟล์สำเร็จ!' });
});

// ดาวน์โหลดไฟล์
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});

// แสดงรายการไฟล์
app.get('/files', (req, res) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
        res.json({ files });
    });
});

// ลบไฟล์
app.delete('/delete/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ message: 'ลบไฟล์ไม่สำเร็จ' });
        res.json({ message: 'ลบไฟล์สำเร็จ!' });
    });
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
