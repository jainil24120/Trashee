const Offer = require('../models/Offer');
const Subscription = require('../models/Subscription');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Partner = require('../models/Partner');

// Create an offer (only partners can create offers)
exports.createOffer = async (req, res) => {
    try {
        const { offerId, offerName, image, offerDescription, originalPrice, discountPrice, brandName, offerType, quantity } = req.body;

        // Ensure the user is a partner
        if (req.userRole !== 'partner') {
            return res.status(403).json({ error: 'Only partners can create offers.' });
        }

          // Check if partner has an active subscription
          const activeSubscription = await Subscription.findOne({
            partner: req.userId,
            status: 'active',
            endDate: { $gte: new Date() }
        }).populate('subscriptionPlan');

        if (!activeSubscription) {
            return res.status(403).json({ error: 'You need an active subscription to create an offer.' });
        }

        const { subscriptionPlan } = activeSubscription;

        // Count the current number of offers created by the partner
        const currentOfferCount = await Offer.countDocuments({ partner: req.userId });

        if (currentOfferCount >= subscriptionPlan.noOfOffer) {
            return res.status(403).json({ error: 'Offer limit reached for your subscription plan.' });
        }

        // Create the offer
        const offer = new Offer({
            offerId,
            offerName,
            image,
            offerDescription,
            originalPrice,
            discountPrice,
            brandName,
            offerType,
            quantity,
            partner: req.userId, // Attach the partner's ID to the offer
            approved: 'waiting' // Default status
        });

        await offer.save();
        res.status(201).json({ message: 'Offer created successfully', offer });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

    // Get all offers (admins can see all offers, partners can only see their own offers)
    exports.getAllOffers = async (req, res) => {
        try {
            let offers;
            if (req.userRole === 'admin') {
                // Admins can see all offers
                offers = await Offer.find();
            } else if (req.userRole === 'partner') {
                // Partners can only see their own offers
                offers = await Offer.find({ partner: req.userId });
            } else {
                return res.status(403).json({ error: 'Access denied. Only admins and partners can view offers.' });
            }

            res.json(offers);
        } catch (error) {
            res.status(500).json({ error: 'Server Error', details: error.message });
        }
    };

// Update an offer (partners and admins can update)
exports.updateOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Find the offer
        const offer = await Offer.findById(id);
        if (!offer) return res.status(404).json({ error: 'Offer not found' });

        // Check if the user is the partner who created the offer or an admin
        if (offer.partner.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to update this offer.' });
        }

        // Update the offer
        const updatedOffer = await Offer.findByIdAndUpdate(id, data, { new: true });
        res.json(updatedOffer);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Delete an offer (partners and admins can delete)
exports.deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the offer
        const offer = await Offer.findById(id);
        if (!offer) return res.status(404).json({ error: 'Offer not found' });

        // Check if the user is the partner who created the offer or an admin
        if (offer.partner.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to delete this offer.' });
        }

        // Delete the offer
        await Offer.findByIdAndDelete(id);
        res.json({ message: 'Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Approve or disapprove an offer (only admins can do this)
exports.approveOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved } = req.body;

        // Ensure the user is an admin
        if (req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Only admins can approve or disapprove offers.' });
        }

        // Update the offer's approval status
        const updatedOffer = await Offer.findByIdAndUpdate(
            id,
            { approved },
            { new: true }
        );

        if (!updatedOffer) return res.status(404).json({ error: 'Offer not found' });

        res.json({ message: 'Offer approval status updated', updatedOffer });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Disapprove an offer (only admins can do this)
// Change approved status to 'disapproved' (only admins can do this)
exports.disapproveOffer = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the user is an admin
        if (req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Only admins can disapprove offers.' });
        }

        // Update the offer's approval status to 'disapproved'
        const updatedOffer = await Offer.findByIdAndUpdate(
            id,
            { approved: 'disapproved' }, // Set approved to 'disapproved'
            { new: true } // Return the updated document
        );

        if (!updatedOffer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        res.json({ message: 'Offer disapproved', updatedOffer });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

