import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import authRoute from './modules/auth/auth.routes.js'
import cookieParser from 'cookie-parser';
import userRoute from './modules/users/user.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
    res.status(200).json({ message: "DevPost API" });
});

app.use('/api', authRoute);
app.use('/user', userRoute);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
    connectDB();
});