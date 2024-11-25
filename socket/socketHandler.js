const Message = require('../src/api/models/Message');

exports.socketHandler = (io) => {
    const onlineUsers = {};
    io.on("connection", (socket) => {
        console.log("New client connected: " + socket.id);


        /** Login to the socket and add the user in onlineUsers array */
        socket.on("user:login", async ({ userId, username }) => {
            onlineUsers[socket.id] = { userId, username };
            io.emit("user:list", Object.values(onlineUsers));
            console.log(Object.values(onlineUsers))

        });

        /** Get a list of all the online users */
        socket.on('getUserList', () => {
            io.emit("user:list", Object.values(onlineUsers));
        });


        /** Checks if the sender and reciver is in onlineUsers and sends a message to the receiver*/
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
                isRead: false
            };

            if (recipientSocketId) {
                io.to(recipientSocketId).emit("message:receive", message);
            } else {
                console.log("Recipient not online.");
            }
        });

        /** Deletes the user from the online Users array on logout */
        socket.on("user:logout", () => {
            delete onlineUsers[socket.id];
            io.emit("user:list", Object.values(onlineUsers));
            console.log(Object.values(onlineUsers))
        });

        /** Marks messages as read in real-time */
        socket.on("message:markRead", ({ fromUserId }) => {
            const senderSocketId = Object.keys(onlineUsers).find(
                (key) => onlineUsers[key].userId === fromUserId
            );

            if (senderSocketId) {
                io.to(senderSocketId).emit("message:readReceipt", {
                    senderId: fromUserId,
                    readerId: onlineUsers[socket.id].userId,
                });
            }
        });

        /** Deletes the user from the online Users array if the user is disconnected */
        socket.on("disconnect", () => {
            delete onlineUsers[socket.id];
            io.emit("user:list", Object.values(onlineUsers));
            console.log(Object.values(onlineUsers))

        });
    });
};


