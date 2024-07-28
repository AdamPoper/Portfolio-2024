import Express, {Request, Response} from 'express';
import projectController from '../controllers/project-controller';

const router = Express.Router();

router.post('/new', projectController.addProject);

export default router;