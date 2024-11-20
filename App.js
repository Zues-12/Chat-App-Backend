const express = require('express');
const cors = require('cors');
const http = require("http");
const { Server } = require('socket.io');
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

const connectDB = require('./config/db');
const routes = require('./routes/index');
const socketHandler = require('./socket/socketHandler');
PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'Content-Disposition'],
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
});


const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Disposition'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api', routes);

socketHandler(io);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

