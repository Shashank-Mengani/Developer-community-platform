import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.status(200).json({ message: "DevPost API" });
});

app.listen(PORT, () => {
    console.log(`server is running on https://localhost:${PORT}`);
    connectDB;
});