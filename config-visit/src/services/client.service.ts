import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";
import { ResultSetHeader } from "mysql2";

const configService = new ConfigService();


export class ClientService {
    async getClientsActive(): Promise<any[]> {
        const query = await configService.getConfig('QUERY_VISIT_CLIENTS_ACTIVE');
        if (!query) throw new Error('No se encontró la configuración para QUERY_VISIT_CLIENTS_ACTIVE');
        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as any[];
    }

    async getActiveLocationsByClient(clientId: number): Promise<any[]> {
        const query = await configService.getConfig('QUERY_VISIT_LOCATIONS_ACTIVE_BY_CLIENT');
        if (!query) throw new Error('No se encontró la configuración para QUERY_VISIT_LOCATIONS_ACTIVE_BY_CLIENT');
        const [rows] = await db.query<RowDataPacket[]>(query, [clientId]);
        return rows as any[];
    }

    //buscar cliente por sede
    async getClientByLocation(locationId: number): Promise<any | null> {
        const query = `select cc.CLIENT_ID,cc.email, cc.name as client_name, ccs.site_name from  CAT_CLIENT cc 
  join CAT_CLIENT_SITE ccs on cc.CLIENT_ID =ccs.CLIENT_ID 
  where ccs.SITE_ID = ? and cc.STATE = 1 and ccs.STATE = 1`;

        const [rows] = await db.query<RowDataPacket[]>(query, [locationId]);
        return rows.length > 0 ? rows[0] : null;
    }
}
