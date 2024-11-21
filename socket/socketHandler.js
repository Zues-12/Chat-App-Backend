// /socket/socketHandler.js
// const jwt = require('jsonwebtoken');
// const cookie = require('cookie');

const onlineUsers = {};

const socketHandler = (io) => {

    // io.use((socket, next) => {
    //     const cookieHeader = socket.handshake.headers.cookie;
    //     if (!cookieHeader) {
    //         return next(new Error("Unauthorized: No cookie provided"));
    //     }
    //     const cookies = cookie.parse(cookieHeader);
    //     const token = cookies.token;
    //     try {
    //         const user = jwt.verify(token, process.env.JWT_SECRET);
    //         socket.user = user;
    //         next();
    //     } catch (err) {
    //         return next(new Error("Unauthorized: Invalid token"));
    //     }
    // });

    io.on("connection", (socket) => {
        console.log("New client connected " + socket.id);

        socket.on("user:login", ({ userId, username }) => {

            // if (!socket.user || socket.user.userId !== userId) {
            //     return socket.emit("error", { message: "Unauthorized login attempt" });
            // }

            onlineUsers[socket.id] = { userId, username };
            io.emit("user:list", Object.values(onlineUsers));
        });

        socket.on('getUserList', () => {
            io.emit("user:list", Object.values(onlineUsers));
        });

        socket.on("message:send", async ({ toUserId, content }) => {

            const sender = onlineUsers[socket.id];
            if (!sender) return;

            const recipientSocketId = Object.keys(onlineUsers).find(
                (key) => onlineUsers[key].userId === toUserId
            );

            const message = {
                sender: {
                    _id: sender.userId,
                    username: sender.username,
                },
                content,
                createdAt: new Date().toISOString(),
            };

            if (recipientSocketId) {
                io.to(recipientSocketId).emit("message:receive", message);
            } else {
                console.log("Recipient not online.");
            }
        });

        socket.on("user:logout", () => {
            console.log(`User logged out: ${socket.id}`);
            delete onlineUsers[socket.id];
            io.emit("user:list", Object.values(onlineUsers));
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            delete onlineUsers[socket.id];
            io.emit("user:list", Object.values(onlineUsers));
        });


        socket.on('joinRoom', () => {
            socket.join('Room')
            console.log(`User ${socket.id} joined room`);
        })

        socket.on('leaveRoom', () => {
            socket.leave("Room")
            console.log(`User ${socket.id} left room `);
        })

        socket.on('sendMessage', message => {
            console.log(message)
            io.to(message.roomId).emit('messageReceived', message);
        });
    });
};

module.exports = socketHandler;

