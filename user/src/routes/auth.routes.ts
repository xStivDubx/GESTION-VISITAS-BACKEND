import { Router } from 'express';
import { UserController } from '../controllers/auth.controller';

const router = Router();

const controller = new UserController();


router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUserById);

export default router;
