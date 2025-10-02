import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/connection";


export class ConfigService {


    async getConfig(code: string): Promise<string | null> {
        const [rows] = await db.query<RowDataPacket[]>("SELECT VALUE FROM CFG_CONFIGURATION WHERE CODE = ?", [code]);
        return rows.length > 0 ? (rows[0].VALUE as string) : null;
    }

    async getAllConfigs(): Promise<any[]> {
        const [rows] = await db.query<RowDataPacket[]>(`SELECT cc.CONFIG_ID as configId,
                                                cc.code,
                                                cc.value,
                                                cc.description FROM CFG_CONFIGURATION cc order by cc.CONFIG_ID`);
        return rows as any[];
    }

    async getConfigById(id: number): Promise<any | null> {
        const [rows] = await db.query<RowDataPacket[]>(`SELECT cc.CONFIG_ID as configId,
                                                        cc.code,
                                                        cc.value,
                                                        cc.description 
                                                        FROM CFG_CONFIGURATION cc WHERE CONFIG_ID = ?`, [id]);

        return rows.length > 0 ? rows[0] : null;
    }

    async updateConfig(id: number, value: string, description: string, updateUser: number): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>("UPDATE CFG_CONFIGURATION SET VALUE = ?, DESCRIPTION=?, UPDATE_USER=? WHERE CONFIG_ID = ?", [value, description, updateUser, id]);
        return result.affectedRows > 0;
    }
} 