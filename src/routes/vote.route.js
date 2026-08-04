import express from 'express';
import { answerVote, answerVotesById, questionVote, questionVotesById } from '../controllers/vote.controller.js';
import { authenticate } from '../middleware/auth.protect.js';

const voteRouter = express.Router();

voteRouter.post('/questions/:id', authenticate, questionVote);
voteRouter.post('/answers/:id', authenticate, answerVote);

voteRouter.get('/questions/:id', questionVotesById);
voteRouter.get('/answers/:id', answerVotesById);

export default voteRouter;