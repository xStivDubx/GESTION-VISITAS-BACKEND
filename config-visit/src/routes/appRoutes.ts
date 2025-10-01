import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();

router.get('/technicians-by-supervisor/:id', controller.getTechniciansBySupervisor);
router.get('/clients-active', controller.getClientsActive);

export default router;
