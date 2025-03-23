require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: 'No authorization header found'
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id || decoded._id; // Ensure the correct key is used

        next();
    } catch (err) {
        return res.status(403).json({
            message: 'Invalid token'
        });
    }
}

module.exports = authMiddleware;
