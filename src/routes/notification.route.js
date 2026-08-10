import express from 'express';
import { authenticate } from 'passport';
import { sharePost } from '../controllers/notification.controller.js';

const router = express.Router();

router.post("/:postId/share", authenticate, sharePost);

export default router;