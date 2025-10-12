import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();


router.get('/', controller.getAllTechnicalVisits);
router.get('/:id', controller.getTechnicalVisitById);
router.post('/init', controller.updateStatusInitVisit);
router.post('/check-in', controller.operationCheckInVisit);
router.post('/check-out', controller.operationCheckOutVisit);

export default router;
