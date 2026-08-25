import express from 'express';
import { createPost, deletePost, getAllPosts, getPostById, getPostsByUser, reactToPost, updatePost } from '../controllers/post.controller.js';
import { authenticate } from '../middleware/auth.protect.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPostSchema } from '../validators/post.validator.js';
import { reactionSchema } from '../validators/reaction.validator.js';
import { profileUpdateLimiter } from '../middleware/rate.limiter.js';
import upload from '../middleware/upload.middleware.js';

const postRoute = express.Router();

postRoute.post('/user/post', authenticate, upload.single("image"), validate(createPostSchema), createPost);

postRoute.post('/:id/reaction', validate(reactionSchema), authenticate, reactToPost);

postRoute.get('/user/:id', authenticate, getPostsByUser);

postRoute.get('/:id/post', authenticate, getPostById);

postRoute.get('/', authenticate, getAllPosts);

postRoute.put('/:id', authenticate, profileUpdateLimiter, updatePost);

postRoute.delete('/:id/post', authenticate, deletePost);

export default postRoute;