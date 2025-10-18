import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();


router.post('/rep-users', controller.getReportUsers);

export default router;
