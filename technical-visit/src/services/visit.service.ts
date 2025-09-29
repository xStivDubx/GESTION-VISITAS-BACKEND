import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";
import { ResultSetHeader } from "mysql2";

const configService = new ConfigService();


export class VisitService {

    async getAllTechnicalVisitsGeneral(): Promise<any[]> {
        const query = await configService.getConfig('QUERY_VISIT_GETALL');
        if (!query) throw new Error('No se encontró la configuración para QUERY_VISIT_GETALL');
        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as any[];
    }

    async getAllTechnicalVisitsBySupervisor(userId: number): Promise<any[]> {
        const query = await configService.getConfig('QUERY_VISIT_GETALL_BY_SUPERVISOR');
        if (!query) throw new Error('No se encontró la configuración para QUERY_VISIT_GETALL_BY_SUPERVISOR');
        const [rows] = await db.query<RowDataPacket[]>(query, [userId]);
        return rows as any[];
    }

    async getAllTechnicalVisitsByTechnician(userId: number): Promise<any[]> {
        const query = await configService.getConfig('QUERY_VISIT_GETALL_BY_TECHNICIAN');
        if (!query) throw new Error('No se encontró la configuración para QUERY_VISIT_GETALL_BY_TECHNICIAN');
        const [rows] = await db.query<RowDataPacket[]>(query, [userId]);
        return rows as any[];
    }

    async getVisitById(visitId: number): Promise<any | null> {
        const query = await configService.getConfig('QUERY_VISIT_GETBYID');
        if (!query) throw new Error('No se encontró la configuración para QUERY_VISIT_GETBYID');
        const [rows] = await db.query<RowDataPacket[]>(query, [visitId]);
        return rows.length > 0 ? rows[0] : null;
    }

}