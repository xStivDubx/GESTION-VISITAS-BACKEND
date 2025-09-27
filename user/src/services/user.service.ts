import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";
import bcrypt from "bcryptjs";

const configService = new ConfigService();

export class UserService {

    async getAllUsers(): Promise<any[]> {
        const query = await configService.getConfig('QUERY_USER_GETALL');
        if (!query) throw new Error('No se encontró la configuración para QUERY_USER_GETALL');

        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as any[];
    }


    async getUserById(userId: number): Promise<any | null> {
        const query = await configService.getConfig('QUERY_USER_GETBYID');
        if (!query) throw new Error('No se encontró la configuración para QUERY_USER_GETBYID');

        const [rows] = await db.query<RowDataPacket[]>(query, [userId]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findUserByUsername(username: string): Promise<any | null> {
        const query = `select USER_ID from ADM_USER WHERE USERNAME = ? and STATE IN (1,2)`
        const [rows] = await db.query<RowDataPacket[]>(query, [username]);
        return rows.length > 0 ? rows[0] : null;

    }

    async findUserByEmail(email: string): Promise<any | null> {
        const query = `select USER_ID from ADM_USER WHERE EMAIL = ? and STATE IN (1,2)`
        const [rows] = await db.query<RowDataPacket[]>(query, [email]);
        return rows.length > 0 ? rows[0] : null;

    }


    async createUser(currentUserId: number, userData: { name: string; lastname: string; email: string; phone: string; username: string; roleId: number; }): Promise<boolean> {

        try {
            // Generar una contraseña temporal
            const tempPassword = Math.random().toString(36).slice(-8); // Genera una cadena aleatoria de 8 caracteres
            console.log("Contraseña temporal generada:", tempPassword);

            // Hashear la contraseña temporal
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            console.log("Contraseña temporal hasheada:", hashedPassword);

            const query = `INSERT INTO ADM_USER (UPDATE_USER,NAME, LASTNAME, EMAIL, PHONE, USERNAME, ROLE_ID, PASSWORD) 
        VALUES (?,?, ?, ?, ?, ?, ?, ?)`;

            // ejecutar la consulta y recuperar el ID del usuario creado
            const [result] = await db.query<ResultSetHeader>(query,
                [
                    currentUserId,
                    userData.name.trim().toLowerCase(),
                    userData.lastname.trim().toLowerCase(),
                    userData.email.trim().toLowerCase(),
                    userData.phone.trim().toLowerCase(),
                    userData.username.trim().toLowerCase(),
                    userData.roleId,
                    hashedPassword
                ]);

            if (result.affectedRows === 0) {
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            return false;
        }
    }

    async updateUser(currentUserId: number, userData: { userId: number, name: string; lastname: string; email: string; phone: string; username: string; roleId: number; }): Promise<boolean> {
        try {
            const query = `UPDATE ADM_USER 
        SET UPDATE_USER=?, NAME = ?, LASTNAME = ?, EMAIL = ?, PHONE = ?, USERNAME = ?, ROLE_ID = ?
        WHERE USER_ID = ?`;

            const [result] = await db.query<ResultSetHeader>(query,
                [
                    currentUserId,
                    userData.name.trim().toLowerCase(),
                    userData.lastname.trim().toLowerCase(),
                    userData.email.trim().toLowerCase(),
                    userData.phone.trim().toLowerCase(),
                    userData.username.trim().toLowerCase(),
                    userData.roleId,
                    userData.userId
                ]);

            if (result.affectedRows === 0) {
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            return false;
        }
    }

    async deleteUser(userId: number, currentUserId: number): Promise<boolean> {
        try {
            const query = `UPDATE ADM_USER 
        SET UPDATE_USER=?, STATE= 0
        WHERE USER_ID = ?`;

            const [result] = await db.query<ResultSetHeader>(query, [currentUserId, userId]);
            if (result.affectedRows === 0) {
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            return false;
        }
    }


    async resetPassword(userId: number, currentUserId: number): Promise<boolean> {
        try {
            // Generar una contraseña temporal
            const tempPassword = Math.random().toString(36).slice(-8); // Genera una cadena aleatoria de 8 caracteres
            console.log("Contraseña temporal generada:", tempPassword);

            // Hashear la contraseña temporal
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            console.log("Contraseña temporal hasheada:", hashedPassword);

            const query = `UPDATE ADM_USER 
        SET PASSWORD = ?, STATE = 2, UPDATE_USER=?
        WHERE USER_ID = ?`;
            const [result] = await db.query<ResultSetHeader>(query, [hashedPassword, currentUserId, userId]);
            if (result.affectedRows === 0) {
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error al reiniciar la contraseña:", error);
            return false;
        }
    }
}
