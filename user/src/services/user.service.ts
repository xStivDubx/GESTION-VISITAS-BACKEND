import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";
import bcrypt from "bcryptjs";
import { sendMail } from "../utils/sendMail";

const configService = new ConfigService();

export class UserService {

    async getAllUsers(): Promise<any[]> {
        const query = await configService.getConfig('QUERY_USER_GETALL');
        if (!query) throw new Error('No se encontró la configuración para QUERY_USER_GETALL');

        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as any[];
    }

    async getAllTechnicalUsers(userId: number): Promise<any[]> {
        const query = await configService.getConfig('QUERY_USER_GETALL_TECHNICAL');
        if (!query) throw new Error('No se encontró la configuración para QUERY_USER_GETALL_TECHNICAL');
        const [rows] = await db.query<RowDataPacket[]>(query, [userId, userId]);
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


    async createUser(currentUserId: number, token: string, userData: { name: string; lastname: string; email: string; phone: string; username: string; roleId: number; }): Promise<number> {

        try {
            // Generar una contraseña temporal
            const tempPassword = Math.random().toString(36).slice(-8); // Genera una cadena aleatoria de 8 caracteres

            // Hashear la contraseña temporal
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            const query = `INSERT INTO ADM_USER (UPDATE_USER,NAME, LASTNAME, EMAIL, PHONE, USERNAME, ROLE_ID, PASSWORD) 
        VALUES (?,?, ?, ?, ?, ?, ?, ?)`;

            console.log("insertando usuario ");
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
                return 0;
            }

            console.log("Enviando correo de notificación al usuario...");


            let body = await configService.getConfig('MAIL_USER_PASS_BODY');
            const subject = await configService.getConfig('MAIL_USER_PASS_SUBJECT');
            body = body?.replaceAll('{username}', userData.username.trim().toLowerCase());
            body = body?.replaceAll('{password}', tempPassword);
            const emailSent = await sendMail(userData.email.trim().toLowerCase(), token, subject, body);

            if (!emailSent) {
                console.error("Error al enviar el correo de notificación.");
                return -1; // Indicar que hubo un error al enviar el correo
            }
            return 1;
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            return 0;
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


    async resetPassword(userId: number, currentUserId: number, username: string, email: string, token: string): Promise<number> {
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
                return 0;
            }


            let body = await configService.getConfig('MAIL_USER_RESET_BODY');
            const subject = await configService.getConfig('MAIL_USER_RESET_SUBJECT');
            body = body?.replaceAll('{username}', username);
            body = body?.replaceAll('{password}', tempPassword);
            const emailSent = await sendMail(email, token, subject, body);

            if (!emailSent) {
                console.error("Error al enviar el correo de notificación.");
                return -1; // Indicar que hubo un error al enviar el correo
            }
            return 1;
        } catch (error) {
            console.error("Error al reiniciar la contraseña:", error);
            return 0;
        }
    }
}
