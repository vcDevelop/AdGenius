import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Replace your current CORS setup with this:
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.FREEPIK_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const MYSTIC_API_URL = "https://api.freepik.com/v1/ai/mystic";
const IMAGEN3_API_URL = "https://api.freepik.com/v1/ai/text-to-image/imagen3";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/adgenius";

const corsOptions = {
    origin: 'http://localhost:5173', // Your Vite frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

// Define Campaign Schema
const campaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    audience: { type: String, required: true },
    budget: { type: Number, required: true },
    category: { type: String, required: true },
    duration: { type: Number, required: true },
    status: { type: String, default: 'draft' },
    generatedImage: { type: String },
    media: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create Models
const User = mongoose.model("User", userSchema);
const Campaign = mongoose.model("Campaign", campaignSchema);

// Make sure this is added after your other routes but before error handlers
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("Authentication failed: No token provided");
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Authentication failed: Invalid token", err);
            return res.sendStatus(403);
        }
        req.user = user;
        console.log("Token authenticated successfully for user:", user.id);
        next();
    });
};

// 🔐 Register Route
app.post("/api/register", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// 🔐 Login Route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        const userData = user.toObject();
        delete userData.password;

        res.json({ message: "Login successful", user: userData, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
});

// 🔐 Get current user route
app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Auth check error:", error);
        res.status(500).json({ message: "Server error during authentication check" });
    }
});

app.post("/api/campaigns", authenticateToken, async (req, res) => {
    console.log("Received request to /api/campaigns");
    console.log("Request body:", req.body); // Log the request body

    try {
        const {
            title,
            description,
            audience,
            budget,
            category,
            duration,
            status,
            generatedImage
        } = req.body;

        // Validation
        if (!title || !description || !audience || !budget || !category || !duration) {
            console.log("Campaign creation error: Missing required fields");
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const newCampaign = new Campaign({
            title,
            description,
            audience,
            budget,
            category,
            duration,
            status: status || 'draft',
            generatedImage,
            createdBy: req.user.id
        });

        const savedCampaign = await newCampaign.save();
        console.log("Campaign created successfully:", savedCampaign);

        res.status(201).json({
            message: "Campaign created successfully",
            campaign: savedCampaign
        });
    } catch (error) {
        console.error("Campaign creation error:", error);
        res.status(500).json({ message: "Server error during campaign creation", error: error.message }); // Include error message for more detail
    }
});

app.get("/api/campaigns", authenticateToken, async (req, res) => {
    try {
        const campaigns = await Campaign.find({ createdBy: req.user.id });
        res.json(campaigns);
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ message: "Server error fetching campaigns", error: error.message });
    }
});

app.post("/generate-image", async (req, res) => {
    try {
        const apiUrl = req.body.model === "classic_fast" ? IMAGEN3_API_URL : MYSTIC_API_URL;
        let model = req.body.model;

        if (apiUrl === MYSTIC_API_URL) {
            const validMysticModels = ['fluid', 'realism', 'zen'];
            if (!validMysticModels.includes(model)) {
                model = 'realism';
                console.log(`Invalid model provided, defaulting to: ${model}`);
            }
        }

        const payload = { ...req.body, model: model };
        const response = await axios.post(apiUrl, payload, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "x-freepik-api-key": API_KEY,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error details:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
});

// 🔁 Check Task Status
app.get("/check-status/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    const apiUrl = req.query.model === "classic_fast" ? IMAGEN3_API_URL : MYSTIC_API_URL;

    try {
        const response = await axios.get(`${apiUrl}/${taskId}`, {
            headers: { "x-freepik-api-key": API_KEY },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error details:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
});

// 🚀 Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));