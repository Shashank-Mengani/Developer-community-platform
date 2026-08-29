import express from 'express';
import { acceptAnswer, createAnswer, getAnswer, getAnswerById, updateAnswer } from '../controllers/answer.controller.js';
import { authenticate } from '../middleware/auth.protect.js';

const router = express.Router();

router.post('/:questionId/answers', authenticate, createAnswer);
router.get('/question/:questionId', authenticate, getAnswer);
router.get('/:answerId', authenticate, getAnswerById);
router.put('/:answerId', authenticate, updateAnswer);
router.patch('/:answerId/accept', authenticate, acceptAnswer);

export default router;