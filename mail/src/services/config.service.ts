import { RowDataPacket } from "mysql2";
import { db } from "../config/connection";


export class ConfigService {


    async getConfig(code: string): Promise<string > {
        const [rows] = await db.query<RowDataPacket[]>("SELECT VALUE FROM CFG_CONFIGURATION WHERE CODE = ?", [code]);
        return rows.length > 0 ? (rows[0].VALUE as string) : '';
    }
} 