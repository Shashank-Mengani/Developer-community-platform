import express from "express";
import { createQuestions, deleteQuestion, getAllQuestionTags, getQuestion, getQuestionByAnswers, getQuestionById, getQuestionBySearch, getQuestionByVotes, getQuestionsByTag } from '../controllers/question.controller.js';
import { authenticate } from "../middleware/auth.protect.js";

const router = express.Router();

router.post('/', authenticate, createQuestions);

router.get('/', authenticate, getQuestion);

router.get('/search', authenticate, getQuestionBySearch);

router.get('/votes', authenticate, getQuestionByVotes);

router.get('/answers', authenticate, getQuestionByAnswers);

router.get('/tags', authenticate, getAllQuestionTags);

router.get('/tag/:tag', authenticate, getQuestionsByTag);

router.get('/:questionId', authenticate, getQuestionById);

router.delete('/:questionId', authenticate, deleteQuestion);

export default router;