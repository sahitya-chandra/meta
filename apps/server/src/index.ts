import express from "express";
import http from 'http';
import cors from "cors";
import dotenv from 'dotenv';
import prisma from "@meta/db";
import { PORT } from "./config.js";
import friendRoutes from "./Routes/route.js";
import { Server } from "socket.io";
import { setupSockets } from "./sockets/index.js";

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", friendRoutes); 

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

setupSockets(io);

// io.on('connection', (socket)=> {
//   console.log("created")

//   socket.on('message', (msg) => {
//     console.log(msg)
//     io.emit('message', `${socket.id.substr(0, 2)} said ${msg}`)
//   })
// })

server.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`);
});


// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { PORT, CORS_ORIGIN } from './config';
// import { setupSockets } from './sockets';
// import prisma from '@meta/db';
// import { userSockets } from './utils';

// dotenv.config();

// const app = express();
// app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: CORS_ORIGIN,
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// setupSockets(io);

// // Optional: Add an HTTP endpoint for internal notifications (e.g., friend requests)
// app.post('/notify/friendRequest', express.json(), async (req, res) => {
//   const { requesterId, addresseeId } = req.body;

//   // Validate (add auth if needed, e.g., shared secret header)
//   if (!requesterId || !addresseeId) return res.status(400).send('Invalid payload');

//   // Fetch friendship from DB (optional, or just notify)
//   const friendship = await prisma.friendship.findFirst({
//     where: { requesterId, addresseeId, status: 'PENDING' },
//   });

//   const addresseeSocketId = userSockets.get(addresseeId);
//   if (addresseeSocketId) {
//     io.to(addresseeSocketId).emit('newFriendRequest', {
//       requesterId,
//       friendshipId: friendship?.id,
//       // Add more data as needed
//     });
//   }

//   res.send('Notification sent');
// });

// server.listen(PORT, () => {
//   console.log(`WebSocket server running on http://localhost:${PORT}`);
// });