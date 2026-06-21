const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    // Join a room based on user ID for notifications, or trip ID for tracking
    socket.join(data.room);
    console.log(`Socket ${socket.id} joined room ${data.room}`);
  });

  // Client (Driver App) will emit GPS location
  socket.on('send_location', (data) => {
    // Broadcast location to anyone subscribed to the given trip ID room (e.g. 'trip_123')
    socket.to(`trip_${data.tripId}`).emit('receive_location', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Endpoint for the Java Spring backend to trigger notifications via this socket server
app.post('/api/notify', (req, res) => {
  const { userId, message, payload } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required' });
  }

  // Emit to specific user room (e.g. 'user_123')
  io.to(`user_${userId}`).emit('notification', {
    message,
    payload,
    timestamp: new Date()
  });

  res.json({ success: true, message: 'Notification sent' });
});

// Endpoint for Java backend to forward chat messages
app.post('/api/chat', (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
  }
  
  io.to(`user_${userId}`).emit('chat_message', message);
  res.json({ success: true, message: 'Chat sent' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Truckmitra Socket.io Server running on port ${PORT}`);
});
