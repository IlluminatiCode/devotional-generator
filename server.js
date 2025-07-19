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
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured on the server.' });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await axios.post(apiUrl, req.body, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error proxying to Gemini API:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({ error: 'Failed to fetch from Gemini API' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
