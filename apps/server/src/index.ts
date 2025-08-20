import express from "express";
import http from 'http';
import cors from "cors";
import dotenv from 'dotenv';
import { PORT } from "./config.js";
import friendRoutes from "./Routes/route.js";
import { setupSockets } from "./sockets/index.js";
import { initIo } from "./utils/socketInstance.js";

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", friendRoutes); 

const server = http.createServer(app)
export const io = initIo(server)

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