import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();


router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUserById);

export default router;
