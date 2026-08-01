import express from 'express';
import { createAnswer } from './answer.controller.js';

const router = express.Router();

router.post('/:id/answers', createAnswer);

export default router;