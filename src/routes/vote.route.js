import express from 'express';
import { authenticate } from '../middleware/auth.protect.js';
import { getVoteStatus, vote } from '../controllers/vote.controller.js';

const voteRouter = express.Router();

voteRouter.post('/', authenticate, vote);

voteRouter.get('/:targetType/:targetId', authenticate, getVoteStatus);

export default voteRouter;