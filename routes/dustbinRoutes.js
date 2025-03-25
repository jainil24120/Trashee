const express = require('express');
const router = express.Router();
const { createDustbin,getDdustbin, updateDustbin, deleteDustbin} = require("../controllers/binController");
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');


router.get("/", getDdustbin);
router.post("/", verifyToken, isAdmin, createDustbin);
router.put("/:id", verifyToken, isAdmin, updateDustbin);
router.delete("/:id", verifyToken, isAdmin, deleteDustbin);

module.exports = router;

