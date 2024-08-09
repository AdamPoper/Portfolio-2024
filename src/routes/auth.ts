import Express from 'express';
import authController from '../controllers/auth-controller';

const router = Express.Router();

router.post('/', authController.getUser);

export default router;