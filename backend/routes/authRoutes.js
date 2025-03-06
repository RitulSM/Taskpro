const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { userSignupSchema, userLoginSchema } = require("../validation/uservalidation");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ;


router.post("/signup", async (req, res) => {
    try {
        const parsedPayload = userSignupSchema.safeParse(req.body);
        if (!parsedPayload.success) {
            return res.status(400).json({ msg: "Invalid input", errors: parsedPayload.error.errors });
        }

        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ msg: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error("Signup error:", error); // Log the actual error
        res.status(500).json({ msg: "Error creating user", error: error.message });
    }
    
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const parsedPayload = userLoginSchema.safeParse(req.body);
        if (!parsedPayload.success) {
            return res.status(400).json({ msg: "Invalid input", errors: parsedPayload.error.errors });
        }

        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ msg: "Error logging in" });
    }
});

module.exports = router;
