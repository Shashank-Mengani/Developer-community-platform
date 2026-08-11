import express from 'express';
import { signIn, signOut, signUp } from '../controllers/auth.controller.js';
import { rateLimiter } from '../middleware/rate.limiter.js';
import { validate } from '../middleware/validate.middleware.js';
import { signUpSchema } from '../validation/auth.validation.js';

const router = express.Router();

router.post('/signup', rateLimiter, validate(signUpSchema), signUp);
router.post('/signin', rateLimiter, signIn);
router.post('/signout', signOut);

export default router;