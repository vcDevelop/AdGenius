import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());  // Enable CORS
app.use(express.json());  // Parse JSON body data

const API_KEY = process.env.FREEPIK_API_KEY;  // Store API key in .env
const MYSTIC_API_URL = "https://api.freepik.com/v1/ai/mystic";
const IMAGEN3_API_URL = "https://api.freepik.com/v1/ai/text-to-image/imagen3";

// Route to generate image
app.post("/generate-image", async (req, res) => {
  try {
    // Determine the API endpoint based on the model
    const apiUrl = req.body.model === "classic_fast" ? IMAGEN3_API_URL : MYSTIC_API_URL;
    console.log(`Calling API: ${apiUrl}`);
    
    // Send the request to Freepik API to generate image
    const response = await axios.post(apiUrl, req.body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-freepik-api-key": API_KEY,  // Include Freepik API key
      },
    });

    // Return the data from the Freepik API
    res.json(response.data);
  } catch (error) {
    // Log and return the error details
    console.error("Error details:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

// Route to check image status
app.get("/check-status/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const apiUrl = req.query.model === "classic_fast" ? IMAGEN3_API_URL : MYSTIC_API_URL;
  console.log(`Checking status at: ${apiUrl}/${taskId}`);
  
  try {
    // Send request to check the image status
    const response = await axios.get(`${apiUrl}/${taskId}`, {
      headers: { "x-freepik-api-key": API_KEY },
    });

    res.json(response.data);  // Return the status data
  } catch (error) {
    // Log and return the error details
    console.error("Error details:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
