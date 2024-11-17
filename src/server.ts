import express, { Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import appointmentRoutes from './routes/appointments';
import path from 'path';
import { verifyPassword } from "./auth";

// Load environment variables
dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from 'public' directory

// Routes
app.use('/api', appointmentRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html')); // Serve the HTML file
});

app.get("/admin-login", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin-login.html'));
});

app.post("/admin-login", async (req, res) => {
    const { username, password } = req.body;

    // Check credentials
    if (
        username === process.env.ADMIN_USERNAME &&
        (await verifyPassword(password, process.env.ADMIN_PASSWORD || ""))
    ) {
        // Successful login: Set a cookie
        res.cookie("auth", "true", { httpOnly: true });
        res.redirect("/admin");
    } else {
        res.status(401).send("Invalid credentials");
    }
});

app.get("/admin", (req, res) => {
    const auth = req.cookies["auth"];
  
    if (auth === "true") {
      res.sendFile(path.join(__dirname, '../public', 'admin.html'));
    } else {
      res.status(403).send("Forbidden");
    }
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
