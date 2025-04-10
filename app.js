const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("../mindmed-backend/src/Routes/authRoute");
const cors = require("cors");

const adminRoutes = require("../mindmed-backend/src/Routes/adminRoutes");
const courseRoutes = require("../mindmed-backend/src/Routes/courseRoute");
const { getDBConnection, connectToDB } = require("./src/config/db");
const moduleRoute = require("../mindmed-backend/src/Routes/module.Route")
const enrollmentRoutes = require("./src/Routes/enrollment.Route");
const notesRoutes = require("./src/Routes/notes.Route")
const app = express();

app.use(cors());

app.use(express.json({ limit: "100mb" })); // Adjust size as necessary
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/",courseRoutes);
app.use("/api/",moduleRoute);
app.use("/api", enrollmentRoutes);
app.use("/api",notesRoutes)




app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});
const PORT = process.env.SERVER_PORT || 5006;
const startServer = async () => {
  try {
    await connectToDB();  
    console.log("✅ Database connected successfully!");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to connect to DB:", error.message);
    process.exit(1);
  }
};

startServer();
