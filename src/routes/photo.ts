import Express from 'express';
import photoController from '../controllers/photo-controller';

const router = Express.Router();

router.get('/all', photoController.getAllPhotos);
router.get('/paged/:pageSize/:pageNumber', photoController.getPhotosPaged);
router.get('/count', photoController.getPhotosTotalCount);

export default router;