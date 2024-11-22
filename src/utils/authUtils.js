const jwt = require("jsonwebtoken");
const { JwtSecret } = require('../config/var')


// Function to generate a JWT token signed with the userId as well as the jwtSecret key
exports.generateToken = (userId) => {
    return jwt.sign({ id: userId }, JwtSecret, { expiresIn: '10d' });
}