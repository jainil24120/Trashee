const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail or any other service
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD // Your email password
    }
});

// Function to send an email
exports.sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: "jainiljain012345@gmail.com", // Sender email
            to, // Recipient email
            subject, // Email subject
            text // Email body
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};