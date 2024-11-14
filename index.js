
const express = require('express');
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Google Generative AI setup
const API_KEY = "AIzaSyCYfYGNtINK1NnyZQdSse8kPaQwosrtXJE";  // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const chat = model.startChat({ history: [] }); // Empty history for now

// Endpoint to receive user input and return DoctorGPT response
app.post('/sendHealthQuery', async (req, res) => {
  const userQuery = req.body.query;

  // Check if this is the first message (empty query)
  if (!userQuery || userQuery.trim() === "") {
    // Return the greeting message if no query is provided
    return res.json({
      response: "Hello! I'm Wellness Wizard, your AI health assistant. How can I help you today? 😊 Feel free to ask me anything ryelated to your health, and I'll do my best to assist!"
    });
  }

  // Send the user query to DoctorGPT (AI model)
  try {
    const result = await chat.sendMessage(
      `You are Wellness Wizard, an AI health assistant. Only answer questions related to health, medicine, and medical queries. If the user asks about something outside of this scope, remind them that you can only provide medical information. Here is the user query: "${userQuery}"`
    );

    // Refine response for more natural tone
    const botResponse = result.response.text().replace(/[*]/g, ''); // Remove stars if present
    const refinedResponse = botResponse.replace(
      /For example:/i,
      "Could you give me more details?"
    );

    res.json({ response: refinedResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ response: "There was an error processing your request." });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

