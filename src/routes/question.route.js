import express from "express";
import { createQuestions, deleteQuestion, getQuestion, getQuestionById, updateQuestion } from '../controllers/question.controller.js';
import { authenticate } from "../middleware/auth.protect.js";

const router = express.Router();

router.post('/', authenticate, createQuestions);
router.get('/', getQuestion);
router.get('/:id', getQuestionById);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;