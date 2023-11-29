const express = require('express')
const cors = require('cors')
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1716314",
  key: "6d753c1a28cee8791eb7",
  secret: "8b4c3ae2e469a6568875",
  cluster: "ap3",
  useTLS: true
});

const app = express();

app.use(cors({
    origin: ['http://localhost:8080', 'https://cha-soket.netlify.app']
}))

app.use(express.json())

app.post('/api/messages', async (req, res) => {
    await pusher.trigger("chat", "message", {
        username: req.body.username,
        message: req.body.message
    });

    res.json([]);
})

console.log('listening to port 8000');
app.listen(8000)