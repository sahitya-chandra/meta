import express from "express";

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Express server is running 🚀" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
