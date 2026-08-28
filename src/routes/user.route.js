import express from 'express';
import { followUser, getAllUsers, getPost, unFollowUser, updateProfile, uploadProfileImage } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.protect.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/:id', authenticate, getPost);

router.get('/', authenticate, getAllUsers);

router.put('/profile/:id', authenticate, updateProfile);

router.put('/profile-image', authenticate, upload.single("avatar"), uploadProfileImage);

router.post('/follow/:id', authenticate, followUser);

router.delete('/unfollow/:id', authenticate, unFollowUser);

export default router;