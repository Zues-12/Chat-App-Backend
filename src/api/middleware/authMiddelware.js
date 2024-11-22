const jwt = require('jsonwebtoken');

const { JwtSecret } = require('../../config/var')
const User = require('../models/User');

/**
 * 
 * @param {object} req - The request object having cookies attached with token
 * @param {object} res - The response object to send back with any erros that may occur 
 * @param {object} next - Attaches the user the req to be accessed by the next function
 * 
 * @async
 * @function
 * 
 * @returns {Promise<void>}
 */

exports.protect = async (req, res, next) => {
    let token;
    if (req.cookies && req.cookies.token) {
        try {
            token = req.cookies.token;
            const decoded = jwt.verify(token, JwtSecret);
            // Attahces the decoded user object (excluding the password) to the request
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