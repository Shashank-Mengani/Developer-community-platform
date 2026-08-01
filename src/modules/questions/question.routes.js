import express from "express";
import { createQuestions, getQuestion, getQuestionById, updateById } from "./question.controller.js";

const router = express.Router();

router.post('/', createQuestions);
router.get('/', getQuestion);
router.get('/:id', getQuestionById);
router.put('/:id', updateById);

export default router;