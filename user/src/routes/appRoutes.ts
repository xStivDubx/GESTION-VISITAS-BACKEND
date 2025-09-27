import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();


router.get('/', controller.getAllUsers);
router.get('/technical/:userId', controller.getAllTechnicalUsers);
router.get('/:id', controller.getUserById);
router.post('/save', controller.saveUser);
router.put('/update', controller.updateUser);
router.put('/delete', controller.deleteUser);
router.put('/reset-password', controller.resetPassword);

export default router;
