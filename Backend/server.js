// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/income', require('./routes/income-route'));
app.use('/api/expense', require('./routes/expense-route'));
app.use('/api/leadger', require('./routes/leadger-route'));
app.use('/api/purchase', require('./routes/purchaseupdate-route'));
app.use('/api/purchase', require('./routes/purchase-route'));
app.use('/api/folder', require('./routes/folder-route'));
app.use('/api/report', require('./routes/report-routes'));
app.use('/api/utils', require('./routes/utils-route'));

// 404 handler for unmatched API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});