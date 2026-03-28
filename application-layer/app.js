import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import adminDonationRoutes from './routes/adminDonationRoutes.js';
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import thankYouRoutes from "./routes/thankYouRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // your React app
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", authRoutes);          
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/admin/donations', adminDonationRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/thankyou", thankYouRoutes);

app.get('/', (req, res) => res.send('Aidify Backend Running'));

export default app;
