import express from 'express';
import { getCurrentUser, refreshAccessToken, signIn, signOut, signUp } from '../controllers/auth.controller.js';
import { rateLimiter } from '../middleware/rate.limiter.js';
import { validate } from '../middleware/validate.middleware.js';
import { signUpSchema } from '../validators/auth.validator.js';
import { authenticate } from '../middleware/auth.protect.js';

const router = express.Router();

router.post('/signup', rateLimiter, validate(signUpSchema), signUp);
router.post('/signin', rateLimiter, signIn);
router.post('/signout', signOut);
router.post('/refresh', refreshAccessToken);
router.get('/me', authenticate, getCurrentUser);

export default router;