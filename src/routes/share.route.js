import express from "express";
import { authenticate } from "../middleware/auth.protect.js";
import { getReceivedShares, sharePost } from "../controllers/share.controller.js";

const shareRoute = express.Router();

shareRoute.post('/:postId/share/:targetUser', authenticate, sharePost);

shareRoute.get('/received', authenticate, getReceivedShares);

export default shareRoute;