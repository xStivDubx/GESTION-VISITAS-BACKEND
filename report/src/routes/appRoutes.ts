import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();


router.get('/rep-users', controller.getReportUsers);
router.get('/rep-clientes', controller.getReportClients);

export default router;
