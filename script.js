const SERVER_URL = 'http://localhost:3000';

// ฟังก์ชันล็อกอิน
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("isLoggedIn", "true");  // เก็บสถานะล็อกอิน
            showApp();
        } else {
            document.getElementById('login-message').textContent = 'เข้าสู่ระบบล้มเหลว!';
        }
    });
}

function showApp() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    loadFiles();
}

// ตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
window.onload = function() {
    if (localStorage.getItem("isLoggedIn") === "true") {
        showApp();
     } else {
        document.getElementById('login-container').style.display = 'block';
    }
};
function logout() {
    localStorage.removeItem("isLoggedIn");  // ลบสถานะล็อกอิน
    document.getElementById('app-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

function previewFile() {
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const file = fileInput.files[0];

    if (!file) {
        previewContainer.innerHTML = ''; // ล้างพรีวิวถ้าไม่มีไฟล์
        return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        // ใช้ FileReader เพื่อแสดงพรีวิวภาพ
        const reader = new FileReader();
        reader.onload = function (e) {
            previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 150px; height: auto;">`;
        };
        reader.readAsDataURL(file);
    } else if (fileExtension === 'pdf') {
        // แสดงชื่อไฟล์ถ้าเป็น PDF
        previewContainer.innerHTML = `<span>${file.name}</span>`;
    } else {
        previewContainer.innerHTML = `<span>ไม่รองรับการพรีวิวไฟล์ประเภทนี้</span>`;
    }
}


// อัปโหลดไฟล์
function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (!file) return alert('กรุณาเลือกไฟล์ก่อนอัปโหลด');

    const formData = new FormData();
    formData.append('file', file);

    fetch(`${SERVER_URL}/upload`, {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById('upload-status').textContent = 'อัปโหลดสำเร็จ!';
        loadFiles();
    });
}
// โหลดรายการไฟล์
function loadFiles() {
    fetch(`${SERVER_URL}/files`)
    .then(res => res.json())
    .then(data => {
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = '';
        data.files.forEach(file => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${file} 
                <button onclick="downloadFile('${file}')">ดาวน์โหลด</button>
                <button onclick="confirmDelete('${file}')">ลบ</button>
            `;
            fileList.appendChild(li);
        });
    });
}

// ดาวน์โหลดไฟล์
function downloadFile(filename) {
    window.location.href = `${SERVER_URL}/download/${filename}`;
}

// ยืนยันและลบไฟล์
function confirmDelete(filename) {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์ ${filename}?`)) {
        fetch(`${SERVER_URL}/delete/${filename}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => loadFiles());
    }
}
