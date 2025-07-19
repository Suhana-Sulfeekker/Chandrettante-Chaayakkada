const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ownerRoutes = require('./routes/OwnerRoutes');
const orderRoutes = require('./routes/OrderRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/owner', ownerRoutes);
app.use('/api/order', orderRoutes);
// Health check route
app.get('/', (req, res) => {
  res.send('Chandrettan\'s Chaayakkada backend is running 🍵');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
