import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";
import { ResultSetHeader } from "mysql2";

const configService = new ConfigService();

export class SiteService {

    async getSitesByClientId(clientId: number): Promise<any[]> {
        const query = await configService.getConfig('QUERY_SITES_BY_CLIENTID');
        if (!query) throw new Error('No se encontró la configuración para QUERY_SITES_BY_CLIENTID');
        const [rows] = await db.query<RowDataPacket[]>(query, [clientId]);
        return rows as any[];
    }

    async getSiteBySiteId(siteId: number): Promise<any> {
        const query = await configService.getConfig('QUERY_SITE_GETBYSITEID');
        if (!query) throw new Error('No se encontró la configuración para QUERY_SITE_GETBYSITEID');
        const [rows] = await db.query<RowDataPacket[]>(query, [siteId]);
        return rows[0] as any;

    }


    async findSiteByNameAndClientId(siteName: string, clientId: number): Promise<any | null> {
        const query = `SELECT SITE_ID FROM CAT_CLIENT_SITE WHERE SITE_NAME = ? AND CLIENT_ID = ? AND STATE = 1`;
        const [rows] = await db.query<RowDataPacket[]>(query, [siteName, clientId]);
        return rows.length > 0 ? rows[0] : null;
    }

    async createSite(clientId: number, siteName: string, department: string, municipality: string, address: string, latitude: number, longitude: number, currentUserId: number): Promise<number> {

        try {
            const query = `
        INSERT INTO CAT_CLIENT_SITE (UPDATE_USER, CLIENT_ID, SITE_NAME, DEPARTMENT, MUNICIPALITY, ADDRESS, LATITUDE, LONGITUDE) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const [result] = await db.query<ResultSetHeader>(query, [
                currentUserId,
                clientId,
                siteName.trim().toLowerCase(),
                department.trim().toLowerCase(),
                municipality.trim().toLowerCase(),
                address.trim().toLowerCase(),
                latitude,
                longitude
            ]);
            if (result.affectedRows === 0) {
                return 0;
            }
            return 1;
        } catch (error) {
            console.error("Error al crear la sede:", error);
            return 0;
        }
    }

    async updateSite(siteId: number, clientId: number, siteName: string, department: string, municipality: string, address: string, latitude: number, longitude: number, currentUserId: number): Promise<number> {

        try {
            const query = `UPDATE CAT_CLIENT_SITE 
            SET UPDATE_USER = ?, CLIENT_ID = ?, SITE_NAME = ?, DEPARTMENT = ?, MUNICIPALITY = ?, ADDRESS = ?, LATITUDE = ?, LONGITUDE = ?
            WHERE SITE_ID = ?`;
            const [result] = await db.query<ResultSetHeader>(query, [
                currentUserId,
                clientId,
                siteName.trim().toLowerCase(),
                department.trim().toLowerCase(),
                municipality.trim().toLowerCase(),
                address.trim().toLowerCase(),
                latitude,
                longitude,
                siteId
            ]);
            if (result.affectedRows === 0) {
                return 0;
            }
            return 1;
        } catch (error) {
            console.error("Error al actualizar la sede:", error);
            return 0;
        }
    }


    async deleteSite(siteId: number, currentUserId: number): Promise<boolean> {
        try {
            const query = `UPDATE CAT_CLIENT_SITE SET STATE = 0, UPDATE_USER = ? WHERE SITE_ID = ?`;
            const [result] = await db.query<ResultSetHeader>(query, [currentUserId, siteId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error al eliminar la sede:", error);
            return false;
        }
    }
}