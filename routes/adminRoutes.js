const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, deleteUser, getTotalCounts, getAllShopDetails, updateShopDetails, deleteShop,getApprovedShops, getWaitingShops, getRejectedShops,approveShop, rejectShop } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');


router.get('/users', verifyToken, isAdmin, getAllUsers);
router.put('/:model/:id', verifyToken, isAdmin, updateUser);
router.delete('/:model/:id', verifyToken, isAdmin, deleteUser);
router.get('/total-counts', verifyToken, isAdmin, getTotalCounts);
router.get('/shops', verifyToken, isAdmin, getAllShopDetails);
router.put('/shops/update/:id', verifyToken, isAdmin, updateShopDetails);
router.delete('/shops/delete/:id', verifyToken, isAdmin, deleteShop);
router.get('/shops/approved', verifyToken, isAdmin, getApprovedShops);
router.get('/shops/waiting', verifyToken, isAdmin, getWaitingShops);
router.get('/shops/rejected', verifyToken, isAdmin, getRejectedShops);
router.put('/shops/:id/approve', verifyToken, isAdmin, approveShop);
router.put('/shops/:id/reject', verifyToken, isAdmin, rejectShop);

module.exports = router;