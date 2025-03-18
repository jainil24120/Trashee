const express = require('express');
const router = express.Router();
const { createOffer, getAllOffers, updateOffer, deleteOffer, approveOffer, disapproveOffer } = require('../controllers/offerController');
const { verifyToken, isPartner, isAdmin } = require('../middleware/authMiddleware');

// Create an offer (only partners can create)
router.post('/offers', verifyToken, isPartner, createOffer);

// Get all offers (admins can see all offers, partners can only see their own offers)
router.get('/offers', verifyToken, getAllOffers);

// Update an offer (partners and admins can update)
router.put('/offers/:id', verifyToken, updateOffer);

// Delete an offer (partners and admins can delete)
router.delete('/offers/:id', verifyToken, isAdmin, deleteOffer);

// Approve or disapprove an offer (only admins can do this)
router.put('/offers/:id/approve', verifyToken, isAdmin, approveOffer);

router.put('/offers/:id/disapprove', verifyToken, isAdmin, disapproveOffer);

module.exports = router;