import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";
import { ResultSetHeader } from "mysql2";

const configService = new ConfigService();


export class VisitService {



    async getTechniciansBySupervisor(supervisorId: number): Promise<any[]> {
        const query = await configService.getConfig('QUERY_TECHNICIANS_BY_SUPERVISOR');
        if (!query) throw new Error('No se encontró la configuración para QUERY_TECHNICIANS_BY_SUPERVISOR');
        const [rows] = await db.query<RowDataPacket[]>(query, [supervisorId]);
        return rows as any[];
    }

    //validar si el tecnico esta activo y asignado al supervisor
    async validateTechnicianActive(technicianId: number): Promise<any | null> {
        const query = `select 
                    user_id,
                    email,
                    name,
                    lastname
                    from ADM_USER au 
                    where au.USER_ID = ? and au.STATE in (1,2)`;

        const [rows] = await db.query<RowDataPacket[]>(query, [technicianId]);
        return rows.length > 0 ? rows[0] : null;
    }


    //buscar visita tecnica por id
    async getVisitById(visitId: number): Promise<any> {
        const query = `SELECT * FROM TRA_VISIT WHERE VISIT_ID = ?`;
        const [rows] = await db.query<RowDataPacket[]>(query, [visitId]);
        return rows[0] as any;
    }

    async getVisitByTechnicianAndDate(technicianId: number, visitDate: string): Promise<any> {
        const query = await configService.getConfig('QUERY_VISIT_BY_TECHNICIAN_AND_DATE');
        if (!query) throw new Error('No se encontró la configuración para QUERY_VISIT_BY_TECHNICIAN_AND_DATE');
        const [rows] = await db.query<RowDataPacket[]>(query, [technicianId, visitDate]);
        return rows[0] as any;
    }

    async getVisitByName(name: string, supervisorId: number): Promise<any> {
        const query = `  SELECT visit_id FROM TRA_VISIT tv WHERE NAME= ? AND tv.SUPERVISOR_ID = ? `;
        const [rows] = await db.query<RowDataPacket[]>(query, [name, supervisorId]);
        return rows[0] as any;
    }

    async createVisitTechnical(name: string, description: string, siteId: number, supervisorId: number, technicianId: number, visitDate: string, comment: string): Promise<number> {
        try {
            console.log("ingresando al metodo de createVisitTechnical en el servicio");
            const query = ` INSERT INTO TRA_VISIT (NAME, DESCRIPTION, SITE_ID, SUPERVISOR_ID, TECHNICIAN_ID, VISIT_DATE, COMMENT) 
                        VALUES (?, ?, ?, ?, ?, ?, ?) `;
            const [result] = await db.query<ResultSetHeader>(query, [name, description, siteId, supervisorId, technicianId, visitDate, comment]);
            if (result.affectedRows === 0) {
                return 0;
            }
            return 1;
        } catch (error) {
            console.error("Error al crear la visita tecnica:", error);
            return 0
        }
    }


    async updateVisitTechnical(visitId: number, name: string, description: string, siteId: number, supervisorId: number, technicianId: number, visitDate: string, comment: string): Promise<number> {
        try {
            console.log("ingresando al metodo de updateVisitTechnical en el servicio");
            const query = ` UPDATE TRA_VISIT 
                            SET NAME = ?, 
                                DESCRIPTION = ?,
                                SITE_ID = ?,
                                SUPERVISOR_ID = ?,
                                TECHNICIAN_ID = ?,
                                VISIT_DATE = ?,
                                COMMENT = ?
                            WHERE VISIT_ID = ? `;
            const [result] = await db.query<ResultSetHeader>(query, [name, description, siteId, supervisorId, technicianId, visitDate, comment, visitId]);

            if (result.affectedRows === 0) {
                return 0;
            }
            return 1;
        } catch (error) {
            console.error("Error al actualizar la visita tecnica:", error);
            return 0;
        }
    }
}