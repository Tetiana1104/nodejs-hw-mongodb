import { Router } from 'express';
import authRouter from './auth.js';
import contactsRouters from './contactsRouters.js';

const router = Router();

router.use('/contacts', contactsRouters);
router.use('/auth', authRouter);

export default router;
