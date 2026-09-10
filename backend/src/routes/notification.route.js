import express from 'express';
import { authenticate } from '../middleware/auth.protect.js';
import { getNotifications, markAllAsRead, markAsRead, sharePost } from '../controllers/notification.controller.js';

const router = express.Router();

router.post("/:postId/share/:userId", authenticate, sharePost);

router.get("/notifications", authenticate, getNotifications);

router.patch("/notifications/read-all", authenticate, markAllAsRead);

router.patch("/notifications/:notificationId/read", authenticate, markAsRead);

export default router;