import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";
import { ResultSetHeader } from "mysql2";

const configService = new ConfigService();

export class ClientService {


    async getAllClients(): Promise<any[]> {
        const query = await configService.getConfig('QUERY_CLIENT_GETALL');
        if (!query) throw new Error('No se encontró la configuración para QUERY_CLIENT_GETALL');
        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as any[];
    }

    async findClientById(clientId: number): Promise<any> {
        const query = await configService.getConfig('QUERY_CLIENT_GETBYID');
        if (!query) throw new Error('No se encontró la configuración para QUERY_CLIENT_GETBYID');
        const [rows] = await db.query<RowDataPacket[]>(query, [clientId]);
       
        return rows[0] as any;
    }

    async findClientByName(clientName: string): Promise<any | null> {
        const query = `SELECT CLIENT_ID FROM CAT_CLIENT WHERE NAME = ? AND STATE = 1`;
        const [rows] = await db.query<RowDataPacket[]>(query, [clientName]);
        return rows.length > 0 ? rows[0] : null;
    }

    async createClient(name: string, concatName: string, email: string, phone: string, currentUserId: number): Promise<number> {

        try {
            const query = `
        INSERT INTO CAT_CLIENT (UPDATE_USER, NAME, CONTACT_NAME, EMAIL, PHONE) 
        VALUES (?, ?, ?, ?, ?)`;

            const [result] = await db.query<ResultSetHeader>(query, [currentUserId, name.trim(), concatName.trim(), email.trim(), phone.trim()]);
            if (result.affectedRows === 0) {
                return 0;
            }
            return 1;
        } catch (error) {
            console.error("Error al crear el cliente:", error);
            return 0;
        }
    }

    async updateCliente(clientId: number, name: string, concatName: string, email: string, phone: string, currentUserId: number): Promise<number> {
        try {
            const query = `UPDATE CAT_CLIENT 
            SET UPDATE_USER = ?, NAME = ?, CONTACT_NAME = ?, EMAIL = ?, PHONE = ?
            WHERE CLIENT_ID = ?`;
            const [result] = await db.query<ResultSetHeader>(query, [currentUserId, name, concatName, email, phone, clientId]);
            if (result.affectedRows === 0) {
                return 0;
            }
            return 1;
        } catch (error) {
            console.error("Error al actualizar el cliente:", error);
            return 0;
        }
    }

    async deleteClient(clientId: number, currentUserId: number): Promise<boolean> {
        try {
            const query = `UPDATE CAT_CLIENT 
            SET STATE = 0, UPDATE_USER = ?
            WHERE CLIENT_ID = ?`;
            const [result] = await db.query<ResultSetHeader>(query, [currentUserId, clientId]);
            if (result.affectedRows === 0) {
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
            return false;
        }
    }

    




}