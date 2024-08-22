import Express from 'express';
import projectController from '../controllers/project-controller';

const router = Express.Router();

router.get('/all', projectController.fetchAllProjects);
router.get('/media/:id', projectController.fetchProjectMedia);

export default router;