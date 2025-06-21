const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { authenticateToken } = require('./middleware/auth');

const app = express();

// Enable CORS (optional, helps if frontend and backend run on different ports)
app.use(cors());

app.use(express.static('public'));

app.use(bodyParser.json());

// Auth routes under /api
app.use('/api', authRoutes);

// Protected profile route
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'This is your profile', user: req.user });
});

// Admin-only route
app.get('/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  res.json({ message: 'User list (admin only)' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
