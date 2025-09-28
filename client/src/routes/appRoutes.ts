import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();


router.get('/', controller.getAllClients);
router.get('/:id', controller.getClientById);
router.post('/save', controller.createClient);
router.put('/update', controller.updateClient);
router.put('/delete', controller.deleteClient);
router.get('/sites-by-client/:id', controller.getSitesByClientId);
router.get('/site/:id', controller.getSiteBySiteId);
router.post('/site/save', controller.createSite);
router.put('/site/update', controller.updateSite);
router.put('/site/delete', controller.deleteSite);
export default router;
