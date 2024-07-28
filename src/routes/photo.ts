import Express, {Request, Response} from 'express';
import photoController from '../controllers/photo-controller';

const router = Express.Router();

router.get('/all', photoController.getAllPhotos);
router.post('/new', photoController.addNewPhoto);

// module.exports = router;
export default router;