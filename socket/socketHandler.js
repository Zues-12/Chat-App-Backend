

exports.socketHandler = (io) => {
    const onlineUsers = {};
    io.on("connection", (socket) => {
        console.log("New client connected: " + socket.id);

        socket.on("user:login", ({ userId, username }) => {
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
    });
};


