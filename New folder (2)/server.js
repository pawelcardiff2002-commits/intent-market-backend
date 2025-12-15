const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/**
 * In-memory storage
 * (simple on purpose)
 */
let intents = [];

// ADD INTENT
app.post('/intent', (req, res) => {
    const intent = req.body;

    if (!intent.item || !intent.seller || !intent.server) {
        return res.status(400).json({ error: 'Invalid intent' });
    }

    intent.timestamp = Date.now();
    intents.push(intent);

    res.json({ success: true });
});

// GET INTENTS
app.get('/intent', (req, res) => {
    const server = req.query.server;
    const now = Date.now();

    // expire after 24h
    intents = intents.filter(i => now - i.timestamp < 24 * 60 * 60 * 1000);

    const filtered = server
        ? intents.filter(i => i.server === server)
        : intents;

    res.json(filtered);
});

// START SERVER
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Intent Market API running on port ${PORT}`);
});
