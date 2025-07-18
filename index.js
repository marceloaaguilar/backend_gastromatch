require('dotenv').config();
const express = require("express");
const userRoutes = require('./routes/users.js');
const chefRoutes = require('./routes/chefs.js');
const reservationRoutes = require('./routes/reservations.js');
const cors = require('cors');
const db = require('./models');
const cookieParser = require('cookie-parser');
const http = require('http');
const {initWebSocket} = require('./websocket');
const messageRoutes = require("./routes/message.js")


const app = express();
const server = http.createServer(app);
initWebSocket(server);

app.use(cookieParser());

app.use(express.json());

app.use(cors({origin: ['http://127.0.0.1:5173', 'http://localhost:5173', process.env.VITE_API_URL], credentials: true,}));

app.use("/api/users", userRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/messages", messageRoutes);

server.listen(process.env.SERVER_PORT || 8080); 