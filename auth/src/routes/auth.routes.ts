import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

const controller = new AuthController();

// GET /hello - Ruta que devuelve Hola mundo
router.get('/hello', controller.helloWorld);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/profile', controller.profile);
router.post('/change-password', controller.changePassword);

export default router;
