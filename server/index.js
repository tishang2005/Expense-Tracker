const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Bhai, server mast chal raha hai on port ${PORT}`));
