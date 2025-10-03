import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";

const configService = new ConfigService();

export class RolePermissionService {


    


    async getPermissionByRoleId(roleId: number): Promise<any[]> {
        const query = await configService.getConfig('QUERY_MODULS_FRONT');
        if (!query) throw new Error('No se encontró la configuración para QUERY_GET_PERMISSIONS_BY_ROLE_ID');
        const [rows] = await db.query<RowDataPacket[]>(query, [roleId]);
        return rows as any[];
    }


}