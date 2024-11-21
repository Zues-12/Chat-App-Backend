const jwt = require('jsonwebtoken');

const { JwtSecret } = require('../../config/var')
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;
    if (req.cookies && req.cookies.token) {
        try {
            token = req.cookies.token;
            const decoded = jwt.verify(token, JwtSecret);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
}