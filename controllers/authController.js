// authController.js
console.log('Auth Controller Loaded');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Consumer = require('../models/Consumer');
const Partner = require('../models/Partner');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' } );
};

// Admin Signup
exports.adminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Check if the email already exists in the database
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
              return res.status(400).json({ error: 'You are already signed up' });
          }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ name, email, password: hashedPassword });
        await admin.save();

        const token = generateToken(admin);
        res.status(201).json({ message: 'Admin Signup successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Consumer Signup
exports.consumerSignup = async (req, res) => {
    try {
        const { name, email, password, phone, pincode } = req.body;
        
        if (!name || !email || !password || !phone || !pincode) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingConsumer = await Consumer.findOne({email});
        if(existingConsumer){
            return res.status(400).json({ error: 'You are already signed up as an Consumer' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const consumer = new Consumer({ name, email, password: hashedPassword, phone, pincode });
        await consumer.save();

        const token = generateToken(consumer);
        res.status(201).json({ message: 'Consumer Signup successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Partner Signup
exports.partnerSignup = async (req, res) => {
    try {
        const { ownerName, email , password, phone } = req.body;

        if (!ownerName || !email || !password || !phone) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingPartner = await Partner.findOne({email});
        if(existingPartner) return res.status(400).json({error: 'You are already signed up as a Partner'});
        const hashedPassword = await bcrypt.hash(password, 10);
        const partner = new Partner({ ownerName, email, password: hashedPassword, phone });
        await partner.save();

        const token = generateToken(partner);
        res.status(201).json({ message: 'Partner Signup successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

exports.login = async (req, res, UserModel) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Debugging: Log the provided password and stored hashed password
        // console.log('Provided Password:', password);
        // console.log('Stored Hashed Password:', user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Debugging: Log the result of the password comparison
        console.log('Password Valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};