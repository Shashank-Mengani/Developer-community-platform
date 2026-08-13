import express from 'express';
import { answerComment, commentQuestion, deleteComment, getComments, questionComment, updateComment } from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/auth.protect.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCommentSchema } from '../validators/comment.validator.js';

const commentRoute = express.Router();

commentRoute.post('/question/:id', validate(createCommentSchema), authenticate, questionComment);
commentRoute.get('/question/:id', commentQuestion);

commentRoute.post('/answer/:id', validate(createCommentSchema), authenticate, answerComment);
commentRoute.get('/answer/:id', getComments);

commentRoute.put('/:id', authenticate, updateComment);

commentRoute.delete('/:id', authenticate, deleteComment);

export default commentRoute;