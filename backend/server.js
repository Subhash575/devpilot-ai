const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "DevPilot AI backend is running!",
  });
});

// AI explanation route
app.post("/api/explain", (req, res) => {
  const { code, question } = req.body;

  if (!code || !question) {
    return res.status(400).json({
      error: "Code and question are required.",
    });
  }

  // Temporary mock response.
  // We will replace this with Claude later.
  const response = `
This is a temporary DevPilot AI response.

You asked:
${question}

Your code:
${code}

Claude API integration will be added after you obtain your Anthropic API access.
  `;

  res.json({
    success: true,
    response,
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DevPilot AI server running on http://localhost:${PORT}`);
});
