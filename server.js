const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.')); // Serve static files

// Add a route for the root path to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'devotional_generator.html'));
});

app.post('/api/generate', async (req, res) => {
    console.log('Received request to /api/generate');
    try {
        console.log('Attempting to get API key...');
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('API key not configured on the server (inside /api/generate).');
            return res.status(500).json({ error: 'API key not configured on the server.' });
        }
        console.log('API key found. Constructing API URL...');
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        console.log('Making request to Gemini API...');
        const response = await axios.post(apiUrl, req.body, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Received response from Gemini API.');
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying to Gemini API:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({ error: 'Failed to fetch from Gemini API' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
