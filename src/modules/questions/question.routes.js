import express from "express";
import { createQuestions, deleteQuestion, getQuestion, getQuestionById, updateQuestion } from "./question.controller.js";

const router = express.Router();

router.post('/', createQuestions);
router.get('/', getQuestion);
router.get('/:id', getQuestionById);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;