import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { RoleService } from '../services/role.service';

const roleService = new RoleService();
export class AppController {




    async getAllRoles(req: Request, res: Response): Promise<Response> {
        try {
            const roles = await roleService.getAllRoles();
            return res.status(200).json(roles);
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener los roles",
                error: error.message
            });
        }
    }

    async getRoleById(req: Request, res: Response): Promise<Response> {
        const roleId = parseInt(req.params.id, 10);
        try {
            const role = await roleService.findRoleById(roleId);
            if (!role) {
                return res.status(404).json({ message: "Rol no encontrado" });
            }
            return res.status(200).json(role);
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener el rol",
                error: error.message
            });
        }
    }

    async getPermissionsByRoleId(req: Request, res: Response): Promise<Response> {
        const roleId = parseInt(req.params.roleId, 10);
        try {
            const permissions = await roleService.findPermissionByRoleId(roleId);
            if (!permissions) {
                return res.status(404).json({ message: "Permisos no encontrados" });
            }
            return res.status(200).json(permissions);
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener los permisos",
                error: error.message
            });
        }
    }

    async createRole(req: Request, res: Response): Promise<Response> {
        const { name, description } = req.body;

        try {
            const currentUser = res.locals.currentUser;

            if (!name || !description) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }

            // Verificar si el rol ya existe
            const existingRole = await roleService.findRoleByName(name);
            if (existingRole) {
                return res.status(409).json({ message: "El rol ya existe" });
            }
            // Crear el nuevo rol
            const result = await roleService.createRole(name, description, currentUser.userId);
            if (result === 0) {
                return res.status(400).json({ message: "Error al crear el rol" });
            }
            return res.status(201).json({ message: "Rol creado exitosamente" });
        } catch (error) {
            console.error("Error al crear el rol:", error);
            return res.status(500).json({
                message: "Error al crear el rol",
                error: error.message
            });
        }
    }

    async updateRole(req: Request, res: Response): Promise<Response> {
        const { roleId, name, description } = req.body;

        try {
            const currentUser = res.locals.currentUser;

            if (!roleId || !name || !description) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }

            // Verificar si el rol existe
            const existingRole = await roleService.findRoleById(roleId);
            if (!existingRole) {
                return res.status(404).json({ message: "no existe el rol a actualizar" });
            }

            //validar  si ya existe un rol con el mismo nombre y no es el mismo rol que se va a actualizar
            const roleWithSameName = await roleService.findRoleByName(name);
            if (roleWithSameName && roleWithSameName.ROLE_ID !== roleId) {
                return res.status(409).json({ message: "Ya existe un rol con el mismo nombre" });
            }

            const result = await roleService.updateRole(roleId, name, description, currentUser.userId);
            if (result === 0) {
                return res.status(400).json({ message: "Error al actualizar el rol" });
            }
            return res.status(200).json({ message: "Rol actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar el rol:", error);
            return res.status(500).json({
                message: "Error al actualizar el rol",
                error: error.message
            });
        }
    }


    async assignPermissionToRole(req: Request, res: Response): Promise<Response> {
        const { roleId, permissionId } = req.body;
        try {
            if (!roleId || !permissionId) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }

            // Verificar si el rol existe
            const role = await roleService.findRoleById(roleId);
            if (!role) {
                return res.status(404).json({ message: "Rol no encontrado" });
            }

            // Verificar si el permiso existe
            const permission = await roleService.findPermissionById(permissionId);
            if (!permission) {
                return res.status(404).json({ message: "Permiso no encontrado" });
            }

            const existingAssignment = await roleService.findAssingPermission(roleId, permissionId);
            if (existingAssignment) {
                //si ya existe una asignacion, se elimina
                const result = await roleService.removePermissionsFromRole(roleId, permissionId);
                if(!result){
                    return res.status(400).json({ message: "Error al eliminar el permiso del rol" });
                }
                return res.status(200).json({ message: "Permiso eliminado del rol exitosamente" });
            }else{
                // Asignar el permiso al rol
                const result = await roleService.assignPermissionsToRole(roleId, permissionId);
                if (!result) {
                    return res.status(400).json({ message: "Error al asignar el permiso al rol" });
                }
                return res.status(200).json({ message: "Permiso asignado al rol exitosamente" });
            }
        } catch (error) {
            console.error("Error al asignar el permiso al rol:", error);
            return res.status(500).json({
                message: "Error al asignar el permiso al rol",
                error: error.message
            });
        }
    }


    async deleteRole (req: Request, res: Response): Promise<Response> {
        const { roleId } = req.body;
        try {
            const currentUser = res.locals.currentUser;
            if (!roleId) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }
            // Verificar si el rol existe
            const existingRole = await roleService.findRoleById(roleId);
            if (!existingRole) {
                return res.status(404).json({ message: "no existe el rol a eliminar" });
            }
            const result = await roleService.deleteRole(roleId, currentUser.userId);
            if (!result) {
                return res.status(400).json({ message: "Error al eliminar el rol" });
            }
            return res.status(200).json({ message: "Rol eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar el rol:", error);
            return res.status(500).json({
                message: "Error al eliminar el rol",
                error: error.message
            });
        }
    }
            


}
