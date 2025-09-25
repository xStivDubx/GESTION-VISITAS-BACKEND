import { RowDataPacket } from "mysql2";
import { db } from "../config/connection";



export class UserService {

    async findByUsername(username: string): Promise<any | null> {
        const query = `
            SELECT 
                u.USER_ID       AS userId,
                u.username      AS username,
                u.password      AS password,
                r.ROLE_ID       AS roleId,
                r.name          AS roleName,
                p.PERMISSION_ID AS permissionId,
                p.name          AS permissionName,
                p.icon          AS icon,
                p.code          AS code,
                p.route_front   AS routeFront
            FROM ADM_USER  u
            LEFT JOIN ADM_ROLE  r 
            ON u.role_id = r.role_id
            LEFT JOIN ADM_ROLE_PERMISSION rp 
            ON r.role_id = rp.role_id
            LEFT JOIN ADM_PERMISSION  p 
            ON rp.permission_id = p.permission_id
            WHERE u.username = ?
            AND u.state IN (1,2)
            AND p.state = 1
            ORDER BY p.name ASC
        `;

        const [rows] = await db.query<RowDataPacket[]>(query, [username]);

        console.log("Filas obtenidas:", rows);
        if (rows.length === 0) return null;
        return rows;
    }



    async findById(userId: number): Promise<any | null> {
      console.log("findById userId:", userId);
        const query = `
SELECT 
      u.user_id       AS userId,
      u.username      AS username,
      u.password      AS password
    FROM ADM_USER u
    WHERE u.user_id = ?
      AND u.state IN (1,2)
  `;

        const [rows] = await db.query<RowDataPacket[]>(query, [userId]);
        console.log("Filas obtenidas:", rows);
        if (rows.length === 0) return null;
        return rows;
    }


    async updatePassword(userId: number, newPassword: string): Promise<boolean> {
        const query = `
    UPDATE ADM_USER 
    SET password = ?, state = 1
    WHERE user_id = ?
  `;

        const [result]: any = await db.query(query, [newPassword, userId]);

        // result.affectedRows devuelve cuántas filas fueron modificadas
        return result.affectedRows !== undefined && result.affectedRows > 0;
    }
}