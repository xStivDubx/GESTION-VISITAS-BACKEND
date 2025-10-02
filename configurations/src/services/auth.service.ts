import { RowDataPacket } from "mysql2";
import { db } from "../config/connection";

/**
 * Servicio utilizado para la validación y gestión de autenticación de usuarios.
 * para el middleware de autenticación.
 */
export class AuthService {


    async getPermissionByRole(roleId: number): Promise<any | null> {
        const sql = `select ap.CODE  from ADM_ROLE_PERMISSION rp
            join ADM_PERMISSION ap ON ap.PERMISSION_ID  = rp.PERMISSION_ID
            where rp.ROLE_ID  = ?`;
        const [rows] = await db.query<RowDataPacket[]>(sql, [roleId]);
        return rows.length > 0 ? rows : null;
    }
} 