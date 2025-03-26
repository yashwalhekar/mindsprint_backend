const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/User.Model");
require("dotenv").config();


const registerUser = async (userData) => {
  const {
    first_name, last_name, dob, email, password,
    phone, address, city, state, country, school
  } = userData;

  // ✅ Validate required fields
  if (!first_name || !last_name || !dob || !email || !password || !phone || !address || !city || !state || !country || !school) {
    throw new Error("Missing required fields");
  }

  // ✅ Check for existing user
  const existingUser = await userModel.getUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // ✅ Hash password asynchronously
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Generate unique user_id
  const user_id = `USR_${Date.now()}`;

  // ✅ Create new user
  await userModel.createUser({
    user_id,
    first_name,
    last_name,
    dob,
    email,
    password: hashedPassword,   // Use hashed password
    phone,
    address,
    city,
    state,
    country,
    school,
    role: "user"   // Default role
  });

  return { message: "User registered successfully!" };
};
const loginUser = async ({ email, password }) => {
  const user = await userModel.getUserByEmail(email);
  if (!user) throw new Error("Invalid Email");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid Password");

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return { message: "Login Successful", token, user };
};

module.exports = { registerUser, loginUser };
