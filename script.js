// เชื่อมตอ WebSocket
const socket = new WebSocket('ws://localhost:8080');
// สวนของ UI
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('message');
const responseDiv = document.getElementById('response');
// การเชื่อมตอ
socket.onopen = () => {
 console.log('Connected to server.');
};
// การตอบกลับจากเซริฟเวอร
socket.onmessage = (event) => {
 responseDiv.innerHTML = `Server says: ${event.data}`;
};
// การสงขอความไปยังเซิรฟ เวอรเมื่อกดปุม
sendBtn.addEventListener('click', () => {
 const message = messageInput.value;
 if (message.trim()) {
 socket.send(message); // สงขอความไปยังเซิรฟเวอร
messageInput.value = ''; // เคลยีรชองขอความ
 } else { alert('Please enter a message.');
 }
});
// การแจงเตือนเม่อืเชื่อมตอหลุด
socket.onclose = () => {
 console.log('Disconnected from server.');
}