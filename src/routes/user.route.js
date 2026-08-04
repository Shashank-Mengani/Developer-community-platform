import express from 'express';
import { getPost, updateProfile } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.protect.js';

const router = express.Router();

router.get('/:id', getPost);

router.put('/profile/:id', authenticate, updateProfile);

export default router;