import express from 'express';
import { createBookmark, createBookPost, getPostBookmark, removeBookmark, removePostBookmark } from '../controllers/bookmark.controller.js';
import { authenticate } from '../middleware/auth.protect.js';

const bookRoute = express.Router();

bookRoute.post('/', authenticate, createBookmark);

bookRoute.post('/posts/:postId', authenticate, createBookPost);

bookRoute.get('/posts/:postId', authenticate, getPostBookmark);

bookRoute.delete('/', authenticate, removeBookmark);

bookRoute.delete('/posts/:bookmarkId', authenticate, removePostBookmark);

export default bookRoute;