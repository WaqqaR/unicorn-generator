import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!process.env.OPENAI_API_KEY) {
            console.error('OpenAI API key is not set');
            return res.status(500).json({ error: 'OpenAI API key is not configured' });
        }

        console.log('Sending request to OpenAI with prompt:', prompt);
        
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API error:', errorData);
            return res.status(response.status).json({
                error: errorData.error?.message || 'Error generating image'
            });
        }

        const data = await response.json();
        console.log('Successfully received response from OpenAI');
        res.json(data);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Add a test endpoint
app.get('/test', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('OpenAI API Key present:', !!process.env.OPENAI_API_KEY);
});