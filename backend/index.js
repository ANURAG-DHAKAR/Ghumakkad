require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const tripRoutes = require('./routes/tripRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const extraRoutes = require('./routes/extraRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const tripsRoutes = require('./routes/tripsRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));

// Static path for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api', extraRoutes); // hosts /ai, /location, /weather, /budget

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
