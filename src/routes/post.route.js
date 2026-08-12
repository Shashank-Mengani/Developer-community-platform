import express from 'express';
import { createPost, deletePost, getPostById, getPostsByUser, reactToPost, updatePost } from '../controllers/post.controller.js';
import { authenticate } from '../middleware/auth.protect.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPostSchema } from '../validators/post.validator.js';
import { reactionSchema } from '../validators/reaction.validator.js';

const postRoute = express.Router();

postRoute.post('/user/post', validate(createPostSchema), authenticate, createPost);

postRoute.post('/:id/reaction', validate(reactionSchema), authenticate, reactToPost);

postRoute.get('/user/:id', authenticate, getPostsByUser);

postRoute.get('/:id/post', authenticate, getPostById);

postRoute.put('/:id', authenticate, updatePost);

postRoute.delete('/:id/post', authenticate, deletePost);

export default postRoute;