import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();


router.get('/', controller.getAllClients);
router.get('/:id', controller.getClientById);
router.post('/save', controller.createClient);
router.put('/update', controller.updateClient);
router.put('/delete', controller.deleteClient);
export default router;
