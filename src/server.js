import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoute from './modules/auth/auth.routes.js'
import cookieParser from 'cookie-parser';
import userRoute from './modules/users/user.route.js';
import questionRoute from './modules/questions/question.routes.js';
import answerRoute from './modules/questions/answer.routes.js';

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
app.use('/question', questionRoute);
app.use('/answer', answerRoute);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
    connectDB();
});