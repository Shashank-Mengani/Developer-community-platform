import express from 'express';
import { answerComment, commentQuestion, deleteComment, getComments, questionComment, updateComment } from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/auth.protect.js';

const commentRoute = express.Router();

commentRoute.post('/question/:id', authenticate, questionComment);
commentRoute.get('/question/:id', commentQuestion);

commentRoute.post('/answer/:id', authenticate, answerComment);
commentRoute.get('/answer/:id', getComments);

commentRoute.put('/:id', authenticate, updateComment);

commentRoute.delete('/:id', authenticate, deleteComment);

export default commentRoute;