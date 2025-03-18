// authRoutes.js
const express = require('express');
const router = express.Router();
const { consumerSignup, partnerSignup, adminSignup, login } = require('../controllers/authController');
const Consumer = require('../models/Consumer');
const Partner = require('../models/Partner');
const Admin = require('../models/Admin');

router.post('/admin/signup', adminSignup);
router.post('/consumer/signup', consumerSignup);
router.post('/partner/signup', partnerSignup);

router.post('/login/consumer', (req, res) => login(req, res, Consumer));
router.post('/login/partner', (req, res) => login(req, res, Partner));
router.post('/login/admin', (req, res) => login(req, res, Admin));



module.exports = router;