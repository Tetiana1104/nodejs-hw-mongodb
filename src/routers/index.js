import { Router } from 'express';
import authRouter from './auth.js';
import contactsRouters from './contactsRouters.js';

const router = Router();

router.use('/contacts', contactsRouters);
router.use('/auth', authRouter);

router.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

export default router;
