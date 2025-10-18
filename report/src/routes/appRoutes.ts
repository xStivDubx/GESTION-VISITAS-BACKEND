import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();


router.get('/rep-users', controller.getReportUsers);
router.get('/rep-clientes', controller.getReportClients);
router.get('/rep-visitas', controller.getReportVisits);

export default router;
