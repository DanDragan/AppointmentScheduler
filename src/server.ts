import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import appointmentRoutes from './routes/appointments';
import path from 'path';

// Load environment variables
dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from 'public' directory

// Routes
app.use('/api', appointmentRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html')); // Serve the HTML file
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment-scheduler')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB', error);
    });
