import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";
import bcrypt from "bcryptjs";
import { sendMail } from "../utils/sendMail";

const configService = new ConfigService();

export class ReportService {

    async getAllUsers(): Promise<any[]> {
        const query = await configService.getConfig('REPORT_USERS');
        if (!query) throw new Error('No se encontró la configuración para QUERY_USER_GETALL');

        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as any[];
    }

    
}
