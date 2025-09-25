import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import { db } from "../config/connection";

export class RolePermissionService {


    async getPermissionByRoleId(roleId: number): Promise<{ permissionId: number, name: string, icon: string, code: string, routeFront: string }[]> {
        const query = `
            SELECT 
            p.permission_id   AS permissionId,
            p.name            AS name,
            p.icon            AS icon,
            p.code            AS code,
            p.route_front     AS routeFront
          FROM ADM_ROLE_PERMISSION rp
          LEFT JOIN ADM_PERMISSION p  ON rp.permission_id = p.permission_id
          WHERE rp.role_id = ? 
            AND p.state = 1
          ORDER BY p.name ASC
            `;

        const [rows] = await db.query<RowDataPacket[]>(query, [roleId]);

        return rows as any[];
    }


}