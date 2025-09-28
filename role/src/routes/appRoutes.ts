import { Router } from 'express';
import { AppController } from '../controllers/Appcontroller';

const router = Router();

const controller = new AppController();


router.get('/', controller.getAllRoles);
router.get('/:id', controller.getRoleById);
router.get('/permissions/:roleId', controller.getPermissionsByRoleId);
router.post('/save', controller.createRole);
router.put('/update', controller.updateRole);
router.post('/assign-permission', controller.assignPermissionToRole);
router.put('/delete', controller.deleteRole);

export default router;
