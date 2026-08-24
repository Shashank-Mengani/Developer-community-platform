import express from "express";
import { codeReview, explainCode, questionTag } from "../controllers/ai.controller.js";
import { authenticate } from "../middleware/auth.protect.js";

const router = express.Router();

router.post('/code-review', authenticate, codeReview);

router.post('/explain-code', authenticate, explainCode);

router.post('/question-tags', authenticate, questionTag);

export default router;