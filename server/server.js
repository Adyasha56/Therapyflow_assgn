const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const sessionRoutes = require('./routes/sessionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server working!' });
});

app.use('/api', sessionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});