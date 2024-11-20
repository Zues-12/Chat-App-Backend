// /socket/socketHandler.js
const Message = require("../models/Message");
const Room = require("../models/Room");

const onlineUsers = {};

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected " + socket.id);

        socket.on("user:login", ({ userId, username }) => {
            onlineUsers[socket.id] = { userId, username };
            io.emit("user:list", Object.values(onlineUsers));
        });

        socket.on('getUserList', () => {
            io.emit("user:list", Object.values(onlineUsers));
        });

        socket.on("message:send", ({ toUserId, content }) => {

            const sender = onlineUsers[socket.id];
            if (!sender) return;

            const recipientSocketId = Object.keys(onlineUsers).find(
                (key) => onlineUsers[key].userId === toUserId
            );

            const message = {
                senderId: sender.userId,
                sender: sender.username,
                content,
                timestamp: new Date().toISOString(),
            };

            if (recipientSocketId) {
                io.to(recipientSocketId).emit("message:receive", message);
            } else {
                console.log("Recipient not online.");
            }
        });


        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            delete onlineUsers[socket.id];
            io.emit("user:list", Object.values(onlineUsers));
        });









        socket.on('joinRoom', (roomId) => {
            socket.join(roomId)
            console.log(`User ${socket.id} joined room ${roomId}`);
        })

        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId)
            console.log(`User ${socket.id} left room ${roomId}`);
        })

        socket.on('sendMessage', message => {
            console.log(message)
            // try {
            //     const message = new Message({ sender: senderId, room: roomId, content });
            // await message.save();
            io.to(message.roomId).emit('messageReceived', message);
            // } catch (err) {
            //     console.error('Error saving message:', err);
            // }
        });

        // socket.on("disconnect", () => {
        //     console.log("Client disconnected");
        // });
    });
};

module.exports = socketHandler;

