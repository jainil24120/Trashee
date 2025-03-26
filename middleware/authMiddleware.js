const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Partner = require('../models/Partner');
const Consumer = require('../models/Consumer');
require('dotenv').config();

exports.verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token' });

        req.userId = decoded.id;
        req.userEmail = decoded.email;

        try {
            // Search for user in all models
            let user = await Admin.findOne({ email: req.userEmail });
            if (!user) user = await Partner.findOne({ email: req.userEmail });
            if (!user) user = await Consumer.findOne({ email: req.userEmail });

            if (!user) return res.status(404).json({ error: 'User not found' });

            req.userRole = user.role; // Attach role to request
            next();
        } catch (error) {
            return res.status(500).json({ error: 'Server error', details: error.message });
        }
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') return res.status(403).json({ error: 'Access denied' });
    next();
};


// Check if the user is a partner
exports.isPartner = (req, res, next) => {
    if (req.userRole !== 'partner') return res.status(403).json({ error: 'Access denied. Only partners can perform this action.' });
    next();
};

exports.isConsumer = (req, res, next) => {
    if (req.userRole !== 'consumer') return res.status(403).json({ error: 'Access denied. Only consumer can perform this action.' });
    next();
};

