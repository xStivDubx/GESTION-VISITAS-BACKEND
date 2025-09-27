import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import { db } from "../config/connection";

export class RoleService {


    async findRoleById(roleId: number): Promise<number | null> {
        const query = `
            select ar.ROLE_ID from ADM_ROLE ar where ar.ROLE_ID = ?
            `;

        const [rows] = await db.query<RowDataPacket[]>(query, [roleId]);

        return rows.length > 0 ? rows[0].ROLE_ID : null;
    }


}