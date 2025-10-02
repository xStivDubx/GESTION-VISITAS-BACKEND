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


    async getTechniciansBySupervisor(supervisorId: number): Promise<any[]> {
        const query = await configService.getConfig('QUERY_TECHNICIANS_BY_SUPERVISOR');
        if (!query) throw new Error('No se encontró la configuración para QUERY_TECHNICIANS_BY_SUPERVISOR');
        const [rows] = await db.query<RowDataPacket[]>(query, [supervisorId]);
        return rows as any[];
    }

    async getClientByVisitId(visitId: number): Promise<any> {
        const query = await configService.getConfig('QUERY_CLIENT_BY_VISIT_ID');
        if (!query) throw new Error('No se encontró la configuración para QUERY_CLIENT_BY_VISIT_ID');
        const [rows] = await db.query<RowDataPacket[]>(query, [visitId]);
        return rows.length > 0 ? rows[0] : null;
    }

    async getClientsActive(): Promise<any[]> {
        const query = await configService.getConfig('QUERY_VISIT_CLIENTS_ACTIVE');
        if (!query) throw new Error('No se encontró la configuración para QUERY_VISIT_CLIENTS_ACTIVE');
        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as any[];
    }

    async validateCheckInExists(visitId: number): Promise<any> {
        const query = `select * from TRA_VISIT tv 
            join TRA_VISIT_DETAIL tvd on tvd.VISIT_ID  = tv.VISIT_ID 
            where tv.VISIT_ID = ?`;
        const [rows] = await db.query<RowDataPacket[]>(query, [visitId]);
        return rows.length > 0 ? rows[0] : null;
    }

    async updateVisitStatus(visitId: number, statusId: number): Promise<number> {
        const query = `UPDATE TRA_VISIT SET STATUS = ? WHERE VISIT_ID = ?`;
        const [result] = await db.query<ResultSetHeader>(query, [statusId, visitId]);
        return result.affectedRows;
    }


    async checkInVisit(visitId: number, latitude: number, longitude: number): Promise<boolean> {
        const connection = await db.getConnection();

        try {
            // Iniciar transacción
            await connection.beginTransaction();

            // Insertar detalle de check-in
            const insertQuery = `INSERT INTO TRA_VISIT_DETAIL (VISIT_ID, CHECKIN_DATETIME, CHECKIN_LATITUDE, CHECKIN_LONGITUDE)
                VALUES (?, NOW(), ?, ?)`;
            const [insertResult] = await connection.query<ResultSetHeader>(insertQuery, [visitId, latitude, longitude]);

            // Actualizar el estado de la visita técnica a '2 - EN PROCESO'
            const updateQuery = `UPDATE TRA_VISIT SET STATUS = 2 WHERE VISIT_ID = ?`;
            const [updateResult] = await connection.query<ResultSetHeader>(updateQuery, [visitId]);

            // Verificar que ambas operaciones fueron exitosas
            if (insertResult.affectedRows === 0 || updateResult.affectedRows === 0) {
                await connection.rollback();
                return false;
            }

            // Confirmar transacción
            await connection.commit();
            return true;

        } catch (error) {
            // Hacer rollback en caso de error
            await connection.rollback();
            console.error("Error en checkInVisit:", error);
            return false;
        } finally {
            // Liberar la conexión
            connection.release();
        }
    }

    async checkOutVisit(visitId: number, latitude: number, longitude: number, resume: string, materialsUsed: string): Promise<boolean> {
        const connection = await db.getConnection();

        try {
            // Iniciar transacción
            await connection.beginTransaction();

            // Insertar detalle de check-out
            const updateCheckout = `UPDATE TRA_VISIT_DETAIL SET CHECKOUT_DATETIME = NOW(), CHECKOUT_LATITUDE = ?, CHECKOUT_LONGITUDE = ?, RESUME = ?, MATERIALS_USED = ?
                WHERE VISIT_ID = ?`;
            const [insertResult] = await connection.query<ResultSetHeader>(updateCheckout, [latitude, longitude, resume, materialsUsed, visitId]);

            // Actualizar el estado de la visita técnica a '3 - FINALIZADA'
            const updateQuery = `UPDATE TRA_VISIT SET STATUS = 3 WHERE VISIT_ID = ?`;
            const [updateResult] = await connection.query<ResultSetHeader>(updateQuery, [visitId]);

            // Verificar que ambas operaciones fueron exitosas
            if (insertResult.affectedRows === 0 || updateResult.affectedRows === 0) {
                await connection.rollback();
                return false;
            }

            // Confirmar transacción
            await connection.commit();
            return true;

        } catch (error) {
            // Hacer rollback en caso de error
            await connection.rollback();
            console.error("Error en checkOutVisit:", error);
            return false;
        } finally {
            // Liberar la conexión
            connection.release();
        }
    }

    async updateCheckInVisit(visitId: number, latitude: number, longitude: number): Promise<number> {
        const query = `UPDATE TRA_VISIT_DETAIL SET CHECKIN_DATETIME = NOW(), CHECKIN_LATITUDE = ?, CHECKIN_LONGITUDE = ?
        WHERE VISIT_ID = ?`;

        const [result] = await db.query<ResultSetHeader>(query, [latitude, longitude, visitId]);
        return result.affectedRows;
    }

}