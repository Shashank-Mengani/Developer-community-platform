import express from 'express';
import { followUser, getPost, unFollowUser, updateProfile, uploadProfileImage } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.protect.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/:id', getPost);

router.put('/profile/:id', authenticate, updateProfile);

router.put('/profile-image', authenticate, upload.single("profileImage"), uploadProfileImage);

router.post('/follow/:id', authenticate, followUser);

router.delete('/unfollow/:id', authenticate, unFollowUser);

export default router;