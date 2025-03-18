// Get ALL USERS;
// Update ALL USER (Admin, Partner, Customer)  Moreover, Partner address,etc detail will be filled through this update API. 
// Delete All USER(Admin, Partner, Customer)
// Total Count(Partner, Consumer, Shop) (lelf to add:- Total QR Code, Total Offer, Total Redeem Offer, Total unRedeem offer, Total Expired offer)

const Admin = require('../models/Admin');
const Partner = require('../models/Partner');
const Consumer = require('../models/Consumer');
const { sendEmail } = require('../utils/emailUtils');

exports.getAllUsers = async (req, res) => {
    try {
        const admins = await Admin.find();
        const partners = await Partner.find();
        const consumers = await Consumer.find();
        res.json({ admins, partners, consumers });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { model, id } = req.params;
    const data = req.body;
    let Model;

    if (model === 'admin') Model = Admin;
    else if (model === 'partner') Model = Partner;
    else if (model === 'consumer') Model = Consumer;
    else return res.status(400).json({ error: 'Invalid model type' });

    try {
        const updatedUser = await Model.findByIdAndUpdate(id, data, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { model, id } = req.params;
    let Model;

    if (model === 'admin') Model = Admin;
    else if (model === 'partner') Model = Partner;
    else if (model === 'consumer') Model = Consumer;
    else return res.status(400).json({ error: 'Invalid model type' });

    try {
        await Model.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });    
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Get total counts of partners, shops, and customers
exports.getTotalCounts = async (req, res) => {
    try {   
        // Count total partners
        const totalPartners = await Partner.countDocuments();

        // Count total shops (each partner can have multiple shops)
        const partners = await Partner.find();
        const totalShops = partners.reduce((acc, partner) => acc + (partner.addresses?.length || 0), 0);

        // Count total consumers
        const totalCustomers = await Consumer.countDocuments();

        // Return the counts
        res.json({ totalPartners, totalShops, totalCustomers });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Get all shop details (admin only)
exports.getAllShopDetails = async (req, res) => {
    try {
        // Fetch all partners from the database
        const partners = await Partner.find();

        // Format the data to include required fields
        const shopDetails = partners.map(partner => ({
            shopId: partner._id, // Shop ID (Partner ID)
            shopName: partner.shopName, // Shop name
            shopAddresses: partner.addresses, // Array of shop addresses
            ownerName: partner.ownerName, // Shop owner name
            phone: partner.phone, // Phone number
            email: partner.email, // Owner email
            status: partner.status // Shop status
        }));

        res.json(shopDetails);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};


// Update shop details (admin only)
exports.updateShopDetails = async (req, res) => {
    try {
        const { id } = req.params; // Shop ID (Partner ID)
        const data = req.body; // Data to update

        // Find and update the partner
        const updatedPartner = await Partner.findByIdAndUpdate(id, data, { new: true });

        if (!updatedPartner) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        res.json({
            message: 'Shop details updated successfully',
            updatedPartner
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Delete a shop (admin only)
exports.deleteShop = async (req, res) => {
    try {
        const { id } = req.params; // Shop ID (Partner ID)
        
        // Find and delete the partner
        const deletedPartner = await Partner.findByIdAndDelete(id);

        if (!deletedPartner) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        res.json({ message: 'Shop deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Get all approved shops (admin only)
exports.getApprovedShops = async (req, res) => {
    try {
        const approvedShops = await Partner.find({ status: 'Approved' });
        const shopDetails = approvedShops.map(partner => ({
            shopId: partner._id,
            shopName: partner.shopName,
            shopAddresses: partner.addresses,
            ownerName: partner.ownerName,
            phone: partner.phone,
            email: partner.email,
            status: partner.status
        }));
        res.json(shopDetails);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Get all waiting shops (admin only)
exports.getWaitingShops = async (req, res) => {
    try {
        const waitingShops = await Partner.find({ status: 'waiting' });
        const shopDetails = waitingShops.map(partner => ({
            shopId: partner._id,
            shopName: partner.shopName,
            shopAddresses: partner.addresses,
            ownerName: partner.ownerName,
            phone: partner.phone,
            email: partner.email,
            status: partner.status
        }));
        res.json(shopDetails);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Get all rejected shops (admin only)
exports.getRejectedShops = async (req, res) => {
    try {
        const rejectedShops = await Partner.find({ status: 'Disapproved' });
        const shopDetails = rejectedShops.map(partner => ({
            shopId: partner._id,
            shopName: partner.shopName,
            shopAddresses: partner.addresses,
            ownerName: partner.ownerName,
            phone: partner.phone,
            email: partner.email,
            status: partner.status
        }));
        res.json(shopDetails);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Approve a shop (admin only)
exports.approveShop = async (req, res) => {
    try {
        const { id } = req.params; // Shop ID (Partner ID)

        // Find and update the shop status to "Approved"
        const updatedPartner = await Partner.findByIdAndUpdate(
            id,
            { status: 'Approved' },
            { new: true }
        );

        if (!updatedPartner) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        // Send approval email to the shop owner
        const emailSubject = 'Your Shop Has Been Approved';
        const emailText = `Dear ${updatedPartner.ownerName},\n\nWe are pleased to inform you that your shop "${updatedPartner.shopName}" has been approved. You can now start using our platform.\n\nBest regards,\nThe Admin Team`;

        await sendEmail(updatedPartner.email, emailSubject, emailText);

        res.json({ message: 'Shop approved successfully', updatedPartner });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// Reject a shop (admin only)
exports.rejectShop = async (req, res) => {
    try {
        const { id } = req.params; // Shop ID (Partner ID)
        const { reason } = req.body; // Reason for rejection

        // Find and update the shop status to "Disapproved"
        const updatedPartner = await Partner.findByIdAndUpdate(
            id,
            { status: 'Disapproved' },
            { new: true }
        );

        if (!updatedPartner) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        // Send rejection email to the shop owner
        const emailSubject = 'Your Shop Has Been Rejected';
        const emailText = `Dear ${updatedPartner.ownerName},\n\nWe regret to inform you that your shop "${updatedPartner.shopName}" has been rejected due to the following reason:\n\n${reason}\n\nIf you have any questions, please contact us.\n\nBest regards,\nThe Admin Team`;

        await sendEmail(updatedPartner.email, emailSubject, emailText);

        res.json({ message: 'Shop rejected successfully', updatedPartner });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

