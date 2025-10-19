import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

const controller = new AuthController();

// GET /hello - Ruta que devuelve Hola mundo
router.post('/login', controller.login);
router.get('/profile', controller.profile);
router.post('/change-password', controller.changePassword);
router.get('/data-graphs', controller.getDataForGraph);

export default router;
