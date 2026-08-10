import express from 'express';
import authRoute from './routes/auth.routes.js'
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js';
import questionRoute from './routes/question.routes.js';
import answerRoute from './routes/answer.routes.js';
import voteRoutes from './routes/vote.route.js';
import commentRoutes from './routes/comment.route.js';
import bookmarkRoutes from './routes/bookmark.route.js';
import postRoutes from './routes/post.route.js';
import googleRoutes from './routes/google.auth.route.js';
import passport from './config/passport.js';
import notificationRoutes from './routes/notification.route.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use('/api', authRoute);
app.use('/user', userRoute);
app.use('/question', questionRoute);
app.use('/answer', answerRoute);
app.use('/votes', voteRoutes);
app.use('/comments', commentRoutes);
app.use('/bookmark', bookmarkRoutes);
app.use('/post', postRoutes);
app.use('/auth', googleRoutes);
app.use('/posts', notificationRoutes);

export default app;