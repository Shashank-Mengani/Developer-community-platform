import express from 'express';
import { followUser, getPost, unFollowUser, updateProfile } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.protect.js';

const router = express.Router();

router.get('/:id', getPost);

router.put('/profile/:id', authenticate, updateProfile);

router.post('/follow/:id', authenticate, followUser);

router.delete('/unfollow/:id', authenticate, unFollowUser);

export default router;