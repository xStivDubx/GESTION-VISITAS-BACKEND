import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";

const configService = new ConfigService();

export class RoleService {


    async getAllRoles(): Promise<any[]> {
        const query = await configService.getConfig('QUERY_ROLE_GETALL');
        if (!query) throw new Error('No se encontró la configuración para QUERY_ROLE_GETALL');
        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as any[];
    }

    async findRoleById(roleId: number): Promise<any | null> {
        const query = await configService.getConfig('QUERY_ROLE_GETBYID');
        if (!query) throw new Error('No se encontró la configuración para QUERY_ROLE_GETBYID');
        const [rows] = await db.query<RowDataPacket[]>(query, [roleId]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findPermissionByRoleId(roleId: number): Promise<any | null> {
        const query = await configService.getConfig('QUERY_ROLE_GET_PERMISSIONS');
        if (!query) throw new Error('No se encontró la configuración para QUERY_ROLE_GET_PERMISSIONS');
        const [rows] = await db.query<RowDataPacket[]>(query, [roleId]);
        return rows as any[];
    }



    async findRoleByName(roleName: string): Promise<any | null> {
        const query = `SELECT ROLE_ID FROM ADM_ROLE WHERE NAME = ? AND STATE = 1`;
        const [rows] = await db.query<RowDataPacket[]>(query, [roleName]);
        return rows.length > 0 ? rows[0] : null;
    }

    async createRole(roleName: string, description: string, currentUserId: number): Promise<number> {

        try {
            const query = `INSERT INTO ADM_ROLE (UPDATE_USER,NAME, DESCRIPTION)
        VALUES (?, ?, ?)`;
            const [result] = await db.query<any>(query, [currentUserId, roleName, description]);

            if (result.affectedRows === 0) {
                return 0;
            }
            return 1;
        } catch (error) {
            console.error("Error al crear el rol:", error);
            return 0;
        }

    }


    async findPermissionById(permissionId: number): Promise<any | null> {
        const query = `SELECT PERMISSION_ID FROM ADM_PERMISSION WHERE PERMISSION_ID = ? AND STATE = 1`;
        const [rows] = await db.query<RowDataPacket[]>(query, [permissionId]);
        return rows.length > 0 ? rows[0] : null;
    }


    async updateRole(roleId: number, roleName: string, description: string, currentUserId: number): Promise<number> {

        try {
            const query = `UPDATE ADM_ROLE 
        SET UPDATE_USER = ?, NAME = ?, DESCRIPTION = ?
        WHERE ROLE_ID = ?`;
            const [result] = await db.query<any>(query, [currentUserId, roleName, description, roleId]);
            if (result.affectedRows === 0) {
                return 0;
            }
            return 1;
        } catch (error) {
            console.error("Error al actualizar el rol:", error);
            return 0;
        }
    }

    async findAssingPermission(roleId: number, permissionId: number): Promise<any | null> {
        const query = `select rp.ROLE_PERMISSION_ID  from ADM_ROLE_PERMISSION rp where rp.ROLE_ID = ? and rp.PERMISSION_ID = ?`
        const [rows] = await db.query<RowDataPacket[]>(query, [roleId, permissionId]);
        return rows.length > 0 ? rows[0] : null;
    }

    async assignPermissionsToRole(roleId: number, permissionId: number): Promise<boolean> {
        try {
            const query = `INSERT INTO ADM_ROLE_PERMISSION (ROLE_ID, PERMISSION_ID) VALUES (?, ?)`;
            const [result] = await db.query<any>(query, [roleId, permissionId]);
            if (result.affectedRows === 0) {
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error al asignar permisos al rol:", error);
            return false;
        }
    }

    async removePermissionsFromRole(roleId: number, permissionId: number): Promise<boolean> {
        try {
            const query = `DELETE FROM ADM_ROLE_PERMISSION WHERE ROLE_ID = ? AND PERMISSION_ID = ?`;
            const [result] = await db.query<any>(query, [roleId, permissionId]);
            if (result.affectedRows === 0) {
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error al eliminar permisos del rol:", error);
            return false;
        }
    }


    
    async deleteRole(roleId: number, currentUserId: number): Promise<boolean> {
        try {
            const query = `UPDATE ADM_ROLE 
        SET STATE = 0, UPDATE_USER = ?
        WHERE ROLE_ID = ?`;
            const [result] = await db.query<any>(query, [currentUserId, roleId]);
           if (result.affectedRows === 0) {
               return false;
           }
           return true;
        } catch (error) {
            console.error("Error al eliminar el rol:", error);
            return false;
        }
    }


}