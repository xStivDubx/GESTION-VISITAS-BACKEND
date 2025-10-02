import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();


router.get('/', controller.getAllConfigs);
router.get('/:id', controller.getConfigById);
router.put('/update', controller.updateConfig);

export default router;
