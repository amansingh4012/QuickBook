const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cinemaRoutes = require('./routes/cinemas');
const screenRoutes = require('./routes/screens');
const movieRoutes = require('./routes/movies');
const showRoutes = require('./routes/shows');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/adminRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const { swaggerUi, specs } = require('./config/swagger');
const socketManager = require('./utils/socketManager');
const seatHoldManager = require('./utils/seatHoldManager');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Allow multiple frontend origins for development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition', 'Content-Length']
}));

// Initialize Socket.io and managers
socketManager.initialize(io);
seatHoldManager.setSocketManager(socketManager);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'QuickBook API Documentation'
}));

// Public routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Protected routes
app.use('/api/users', userRoutes);
app.use('/api/cinemas', authMiddleware, cinemaRoutes);
app.use('/api/screens', authMiddleware, screenRoutes);
app.use('/api/movies', authMiddleware, movieRoutes);
app.use('/api/shows', authMiddleware, showRoutes);
app.use('/api/bookings', authMiddleware, bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Admin routes (authentication and role validation handled in adminRoutes)
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`Socket.io server ready for real-time connections`);
});

module.exports = { app, server, io };