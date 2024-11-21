const jwt = require("jsonwebtoken");
const { JwtSecret } = require('../config/var')

exports.generateToken = (userId) => {
    return jwt.sign({ id: userId }, JwtSecret, { expiresIn: '10d' });
}