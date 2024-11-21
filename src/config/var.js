exports.NodeEnv = process.env.NODE_ENV;
exports.JWTSecret = process.env.JWT_SECRET;
exports.Port = process.env.PORT;
exports.MongoUri = process.env.MONGO_URI;
exports.corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Disposition'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};