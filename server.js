import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Store API key here - Replace 'your-api-key' with your actual OpenAI API keyd
const OPENAI_API_KEY = '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';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});