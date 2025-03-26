const express = require('express');
const router = express.Router();
const {getPointFromBin} = require("../controllers/binPointController");
const { verifyToken } = require('../middleware/authMiddleware');

router.post("/",verifyToken, getPointFromBin)

module.exports = router;