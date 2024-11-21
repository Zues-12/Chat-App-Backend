const express = require('express');
const cors = require('cors');
const http = require("http");
const { Server } = require('socket.io');
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

const { connectDB } = require('./src/config/db');
const routes = require('./src/api/routes/index');
const { socketHandler } = require('./socket/socketHandler');
const { corsOptions, Port } = require('./src/config/var');

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: corsOptions
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/api', routes);

socketHandler(io);

server.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
});

