import Express from 'express';
import projectController from '../controllers/project-controller';
import photoController from '../controllers/photo-controller';

const router = Express.Router();

router.post('/new/project', projectController.addProject);
router.post('/new/photo', photoController.addNewPhoto);

export default router;