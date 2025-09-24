import { RowDataPacket } from "mysql2";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";

const configService = new ConfigService();

export class UserService {

    async getAllUsers(): Promise<any[]> {
        const query = await configService.getConfig('QUERY_USER_GETALL');
        console.log("UserService - getAllUsers - query:", query);
        if (!query) throw new Error('No se encontró la configuración para QUERY_USER_GETALL');
        
        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as any[];
    }


    async getUserById(userId: number): Promise<any | null> {
        const query = await configService.getConfig('QUERY_USER_GETBYID');
        if (!query) throw new Error('No se encontró la configuración para QUERY_USER_GETBYID');

        const [rows] = await db.query<RowDataPacket[]>(query, [userId]);
        return rows.length > 0 ? rows[0] : null;
    }

    
}