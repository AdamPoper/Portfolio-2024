import Express from 'express';
import photoController from '../controllers/photo-controller';

const router = Express.Router();

router.get('/all', photoController.getAllPhotos);

export default router;