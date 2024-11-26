// src/routes/index.ts
import { Router } from 'express';
import { getFestivals } from '../controllers/festivalController';

const router = Router();

// Define your routes here
router.get('/api/festivals', getFestivals);

export default router;
