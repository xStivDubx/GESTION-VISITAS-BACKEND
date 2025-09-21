import { AppDataSource } from "../config/data-source";
import { AdmUser } from "../models/user.entity";
import { Role } from '../models/role.entity';
import { RolePermission } from "../models/role-permission.entity";

export class RolePermissionService {

    private rolePermissionRepository = AppDataSource.getRepository(RolePermission);

    async getPermissionByRoleId(roleId: number): Promise<{permissionId: number, name: string, icon: string, code: string, routeFront: string}[]> {
        const rolePermissions = await this.rolePermissionRepository.find({
            where: { role: { roleId }, permission: { state: 1 } },
            relations: ['permission'],
            order: { permission: { name: 'ASC' } }
        });

        // Mapear para devolver solo las propiedades específicas del objeto permission
        return rolePermissions.map(rp => ({
            permissionId: rp.permission.permissionId,
            name: rp.permission.name,
            icon: rp.permission.icon,
            code: rp.permission.code,
            routeFront: rp.permission.routeFront
        }));
    }


}