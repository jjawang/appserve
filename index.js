const express = require('express');
const cors = require('cors');
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1716314',
  key: '6d753c1a28cee8791eb7',
  secret: '8b4c3ae2e469a6568875',
  cluster: 'ap3',
  useTLS: true
});

const app = express();
app.use(cors({
  origin: ['http://localhost:8080', 'https://cha-soket.netlify.app']
}));
app.use(express.json());

const rooms = {}; // 방 정보 저장용 객체
const messages = {}; // 방마다의 채팅 메시지 저장용 객체

// 메시지 전송 엔드포인트
app.post('/api/messages', async (req, res) => {
  const { username, message, room } = req.body;

  await pusher.trigger(`chat-${room}`, 'message', {
    username,
    message
  });

  if (!messages[room]) {
    messages[room] = [];
  }
  messages[room].push({ username, message });

  res.json([]);
});

// 새로운 방 생성 엔드포인트
app.post('/api/create-room', (req, res) => {
  const { roomName } = req.body;
  rooms[roomName] = true;
  messages[roomName] = []; // 방 생성 시 빈 배열 초기화
  res.json({ success: true });
});

// 방 목록 반환 엔드포인트
app.get('/api/rooms', (req, res) => {
  res.json({ rooms: Object.keys(rooms) });
});

// 방별 채팅 내용 반환 엔드포인트
app.get('/api/messages', (req, res) => {
  const { room } = req.query;
  res.json({ messages: messages[room] || [] });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
