import express from 'express';
import { createAnswer, getAnswer, getAnswerById, updateAnswer } from '../controllers/answer.controller.js';

const router = express.Router();

router.post('/:id/answers', createAnswer);
router.get('/', getAnswer);
router.get('/:id', getAnswerById);
router.put('/:id', updateAnswer);

export default router;