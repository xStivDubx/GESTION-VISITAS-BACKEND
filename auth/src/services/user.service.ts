import { RowDataPacket } from "mysql2";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";


const configService = new ConfigService();
export class UserService {

    async findByUsername(username: string): Promise<any> {
        const query = await configService.getConfig('QUERY_FIND_BY_USER');
        if (!query) {
            throw new Error("No se encontró la configuración para 'QUERY_USER_BY_USERNAME'");
        }
        const [rows] = await db.query<RowDataPacket[]>(query, [username]);

        if (rows.length === 0) return null;
        return rows;
    }





    async findById(userId: number): Promise<any | null> {
        try {
            console.log("findById userId:", userId);

            const query = await configService.getConfig('QUERY_FIND_USER_BY_ID');
            if (!query) {
                throw new Error("No se encontró la configuración para 'QUERY_FIND_USER_BY_ID'");
            }
            const [rows] = await db.query<RowDataPacket[]>(query, [userId]);
            if (rows.length === 0) return null;

            return rows;
        } catch (error) {
            console.error("Error en findById:", error);
            return null;
        }

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