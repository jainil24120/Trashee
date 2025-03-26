const Consumer = require("../models/Consumer")
const Dustbin = require("../models/Dustbin");
const Qr = require("../models/Qr");
require("dotenv").config();
const jwt = require('jsonwebtoken');

exports.getPointFromBin = async (req, res) => {
    const { code } = req.body;

    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });

    const verifyToken = (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return { valid: true, expired: false, decoded };
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return { valid: false, expired: true, message: "Token has expired" };
            }
            return { valid: false, expired: false, message: error.message };
        }
    };

    const result = verifyToken(token);

    if (result.valid) {
        console.log("✅ Token is valid:", result.decoded);
    } else if (result.expired) {
        console.error("⛔ Token has expired:", result.message);
    } else {
        return res.status(401).json({ success: false, message: "Invalid token." });
    }   

    if (result.expired) {
        console.error("⛔ Token has expired:", result.message);
        return res.status(401).json({ success: false, message: result.message });
      }

    const User = await Consumer.findOne({ email: result.decoded?.email});

    if (!User) {
        return res.status(404).json({ success: false, message: "Consumer not found" });
    }

    const regex = /^(OF|ON)(\d{6})([A-Z0-9]{3})(D)(\d{2})(\d{14})(EM|10|20|30|40|50|60|70|80|90|FL)$/;

    if (!regex.test(code)) {
        return res.status(400).json({ message: ' Invalid code format' });

    }

    const type = code.slice(0, 2); // First two letters (ON or OF)
    const dustbinId = code.slice(8, 11); // Extract Dustbin ID

    if (!dustbinId) {
        return res.status(400).json({ message: 'Invalid dustbin ID extracted' });
    }

    const dustbin = await Dustbin.findOne({binCode: dustbinId, type: type});

    console.log(dustbin);

    if(!dustbin){
        return res.status(400).json({ message: 'Dustbin not found'});
    }

    if(dustbin){
        // Random points between 5 to 10
        const points = Math.floor(Math.random() * 6) + 5;

        if (type === 'OF') {
            const newQr = new Qr({
                qrString: code,
                consumer: User._id,
                dustbin: dustbin._id
              });
              await newQr.save();
              
              User.points +=  points;
              User.save();

            return res.status(200).json({ message: 'Offline dustbin detected and point will added to the consumer', points });
        }

        if(type== 'ON'){
            try{
                const qr = await Qr.findOne({ qrString: code});
                if(!qr) return res.status(400).json({message: 'Qr is invalid' });

                return res.status(200).json({ message: 'Point added to the User', points });
            }catch(err){
                return res.status(500).json({success: 'false', message: 'Somethinig went wrong while checking the QR code'});
            }
        }
    }    
}