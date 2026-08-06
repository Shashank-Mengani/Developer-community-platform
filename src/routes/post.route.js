import express from 'express';
import { createPost, updatePost } from '../controllers/post.controller.js';
import { authenticate } from '../middleware/auth.protect.js';

const postRoute = express.Router();

postRoute.post('/:id', authenticate, createPost);

postRoute.put('/:id', authenticate, updatePost);

export default postRoute;