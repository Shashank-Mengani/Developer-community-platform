import express from 'express';
import { createBookmark, removeBookmark } from '../controllers/bookmark.controller.js';
import { authenticate } from '../middleware/auth.protect.js';

const bookRoute = express.Router();

bookRoute.post('/', authenticate, createBookmark);

bookRoute.delete('/', authenticate, removeBookmark);

export default bookRoute;