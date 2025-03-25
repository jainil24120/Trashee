// Server index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const offerRoutes = require('./routes/offerRoutes'); // Add this line
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const subscription = require("./routes/subscribeRoutes");
const dustbin = require("./routes/dustbinRoutes");

const app = express();
app.use(express.json());
// Allow requests from your Flutter frontend
// app.use(cors({
//   origin: 'http://your-flutter-app-url', // Replace with your Flutter app URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', offerRoutes); // Add this line
app.use('/api/subscription',paymentRoutes);
app.use('/api/subscriptionplan',subscription);
app.use('/api/dustbin',dustbin);

app.get('/',(req,res)=>{
    res.send("hellow world");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

