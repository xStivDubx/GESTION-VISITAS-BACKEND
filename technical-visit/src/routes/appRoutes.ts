import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();


router.get('/', controller.getAllTechnicalVisits);
router.get('/:id', controller.getTechnicalVisitById);

export default router;
