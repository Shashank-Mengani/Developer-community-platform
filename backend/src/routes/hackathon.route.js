import express from 'express';
import { deleteHackathon, getHackathonById, getHackathons, postHackathon, registerHackathon, searchHackathon, unregisterHackathon } from '../controllers/hackathon.controller.js';
import { authenticate } from '../middleware/auth.protect.js'

const router = express.Router();

router.post('/', authenticate, postHackathon);

router.get('/', authenticate, getHackathons);

router.get('/search', authenticate, searchHackathon);

router.post('/:hackathonId/register', authenticate, registerHackathon);

router.post('/:hackathonId/unregister', authenticate, unregisterHackathon);

router.get('/:hackathonId', authenticate, getHackathonById);

router.delete('/:hackathonId', authenticate, deleteHackathon);

export default router;