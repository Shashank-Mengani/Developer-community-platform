import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import connectDB from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.status(200).json({ message: "DevPost API" });
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
    connectDB();
});