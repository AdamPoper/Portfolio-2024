import Express from 'express';
import projectController from '../controllers/project-controller';
import photoController from '../controllers/photo-controller';
import userController from '../controllers/user-controller';

const router = Express.Router();

router.post('/new/project', projectController.addProject);
router.post('/new/photo', photoController.addNewPhoto);
router.post('/preferences/fileLocation', userController.updateFileStoragePreference);

export default router;