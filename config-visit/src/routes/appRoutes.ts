import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();

router.get('/supervisors', controller.getSupervisors);
router.get('/technicians-by-supervisor/:id', controller.getTechniciansBySupervisor);
router.get('/clients-active', controller.getClientsActive);
router.get('/active-locations-by-client/:id', controller.getActiveLocationsByClient);
router.post('/create-visit', controller.createVisitTechnical);
router.put('/update-visit', controller.updateVisitTechnical);

export default router;
