// authenticateToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access Denied' });
    }

    // Remove "Bearer " from the token string
    const tokenString = token.split(' ')[1];

    jwt.verify(tokenString, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            
            console.error('Token Verification Error:', err);
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        req.user = user;
        next();
    });
};