import express from "express";
import { createQuestions, deleteQuestion, getQuestion, getQuestionById, updateQuestion } from '../controllers/question.controller.js';
import { authenticate } from "../middleware/auth.protect.js";

const router = express.Router();

router.post('/', authenticate, createQuestions);
router.get('/', authenticate, getQuestion);
router.get('/:questionId', authenticate, getQuestionById);
router.put('/:questionId', authenticate, updateQuestion);
router.delete('/:questionId', authenticate, deleteQuestion);

export default router;