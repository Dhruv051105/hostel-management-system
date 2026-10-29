
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

const User = require("./models/User");
const Complaint = require("./models/Complaint");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Basic security and request configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

// Stricter limit for login and registration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

const validEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Health check
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    message: "Hostel Management API is running",
  });
});

// Register a student account.
// Public registration can never assign the admin role.
app.post("/api/auth/register", authLimiter, async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 80 ||
      typeof email !== "string" ||
      !email.trim() ||
      email.trim().length > 254 ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return res.status(400).json({
        message: "Please provide valid registration details.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!validEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (phone !== undefined && phone !== "") {
      if (typeof phone !== "string" || !/^\d{10}$/.test(phone)) {
        return res.status(400).json({
          message: "Phone number must contain exactly 10 digits.",
        });
      }
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        message: "Password must be between 8 and 128 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      ...(phone ? { phone } : {}),
      passwordHash,
      role: "student",
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid registration data.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

// Log in
app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

// Return the authenticated user's information
app.get("/api/auth/me", apiLimiter, authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "name email phone role"
    );

    if (!user) {
      return res.status(401).json({
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      message: "Authentication successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Authentication check error:", error.message);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

// Create a complaint
app.post(
  "/api/complaints",
  apiLimiter,
  authMiddleware,
  async (req, res) => {
    try {
      const { title, description, category } = req.body;

      if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 120 ||
        typeof description !== "string" ||
        !description.trim() ||
        description.trim().length > 2000 ||
        typeof category !== "string" ||
        !["Maintenance", "Cleanliness", "Electrical", "Other"].includes(
          category
        )
      ) {
        return res.status(400).json({
          message: "Invalid complaint data.",
        });
      }

      const complaint = new Complaint({
        student: req.user.userId,
        title: title.trim(),
        description: description.trim(),
        category,
      });

      await complaint.save();

      return res.status(201).json({
        message: "Complaint created successfully.",
        complaint,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Invalid complaint data.",
        });
      }

      console.error("Complaint creation error:", error.message);

      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
);

// Students see their own complaints; admins see all complaints.
app.get(
  "/api/complaints",
  apiLimiter,
  authMiddleware,
  async (req, res) => {
    try {
      const filter =
        req.user.role === "admin"
          ? {}
          : { student: req.user.userId };

      const complaints = await Complaint.find(filter)
        .populate("student", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        count: complaints.length,
        complaints,
      });
    } catch (error) {
      console.error("Complaint fetch error:", error.message);

      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
);

// Admin-only complaint status update
app.patch(
  "/api/complaints/:id/status",
  apiLimiter,
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: "Admin access required.",
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          message: "Invalid complaint ID.",
        });
      }

      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved",
      ];

      if (
        typeof status !== "string" ||
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          message: "Invalid complaint status.",
        });
      }

      const complaint = await Complaint.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true }
      ).populate("student", "name email");

      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found.",
        });
      }

      return res.status(200).json({
        message: "Complaint status updated successfully.",
        complaint,
      });
    } catch (error) {
      console.error("Status update error:", error.message);

      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
);

// Start the server
async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not configured in .env");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured in .env");
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
