import { Router } from 'express';
import { thoughtRouter } from './thoughtRoutes.js';
import { userRouter } from './userRoutes.js';
const router = Router();
router.use('/thoughts', thoughtRouter);
router.use('/users', userRouter);
export default router;
