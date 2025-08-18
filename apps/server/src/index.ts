import express from "express";
import prisma from "@meta/db";
import cors from "cors";

import friendRoutes from "./Routes/route.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", friendRoutes); 


// Test route
app.get("/", (req, res) => {
  res.json({ message: "Express server is running 🚀" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
