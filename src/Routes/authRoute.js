const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../Controllers/authController");
const authMiddleware = require("../Middleware/authMiddleware")

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);


module.exports = router;
