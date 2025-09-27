import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { ConfigService } from '../services/config.service';

const userService = new UserService();
const roleService = new RoleService();
const configService = new ConfigService();

export class AppController {




    getAllUsers = async (req: Request, res: Response) => {
        try {

            const users = await userService.getAllUsers();
            return res.status(200).json({ data: users });
        } catch (error) {
            console.error("Error en el proceso de obtención de usuarios:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de obtención de usuarios", error: error.message });
        }
    }

    getUserById = async (req: Request, res: Response) => {
        const userId = Number(req.params.id);
        try {
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            return res.status(200).json({ data: user });
        } catch (error) {
            console.error("Error en el proceso de obtención de usuario:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de obtención de usuario", error: error.message });
        }
    }

    getAllTechnicalUsers = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.userId);
            const users = await userService.getAllTechnicalUsers(userId);
            return res.status(200).json({ data: users });
        } catch (error) {
            console.error("Error en el proceso de obtención de usuarios técnicos:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de obtención de usuarios técnicos", error: error.message });
        }
    }

    saveUser = async (req: Request, res: Response) => {
        const { name, lastname, email, phone, username, roleId } = req.body;

        try {
            const currentUser = res.locals.currentUser;
            console.log("Datos recibidos para crear usuario:", req.body);
            //validar parametros
            if (!name || !lastname || !email || !phone || !username || !roleId) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }

            console.log("Validando parámetros para crear usuario");
            //validar que name y lastname sean alfabeticos y tenga espacios
            const nameRegex = /^[A-Za-z\s]+$/;
            if (!nameRegex.test(name) || !nameRegex.test(lastname)) {
                return res.status(400).json({ message: "El nombre y apellido solo deben contener letras" });
            }

            //validar que el email tenga formato correcto
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "El email no tiene un formato válido" });
            }

            //validar que el phone tenga formato correcto
            const phoneRegex = /^\+?[0-9]{7,15}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: "El teléfono no tiene un formato válido" });
            }

            //validar que username tenga al menos 5 caracteres y sin espacios
            if (username.length < 5 || username.includes(' ')) {
                return res.status(400).json({ message: "El username debe tener al menos 5 caracteres y no debe contener espacios" });
            }

            console.log("Validando existencia de usuario para crear nuevo usuario");
            //validar si ya existe un usuario con ese username
            const existingUserByUsername = await userService.findUserByUsername(username);
            if (existingUserByUsername) {
                return res.status(409).json({ message: "Ya existe un usuario con ese username" });
            }

            //validar si ya existe un usuario con ese email
            const existingUserByEmail = await userService.findUserByEmail(email);
            if (existingUserByEmail) {
                return res.status(409).json({ message: "Ya existe un usuario con ese email" });
            }

            //validar que roleId exista
            const role = await roleService.findRoleById(roleId);
            if (!role) {
                return res.status(400).json({ message: "No existe el rol seleccionado" });
            }

            console.log("Creando usuario");
            const token = req.headers['authorization']?.split(' ')[1];
            const result = await userService.createUser(currentUser.userId, token, { name, lastname, email, phone, username, roleId });
            if (result === 1) {
                res.status(200).json({ message: "Usuario creado exitosamente" });
            }
            if (result === 0) {
                res.status(500).json({ message: "No fue posible crear el usuario, favor intente más tarde" });
            }
            if (result === -1) {
                res.status(500).json({ message: "Usuario creado pero no fue posible enviar el correo de notificación" });
            }

        } catch (error) {
            console.error("Error en el proceso de creación de usuario:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de creación de usuario", error: error.message });
        }
    }


    updateUser = async (req: Request, res: Response) => {
        const { userId, name, lastname, email, phone, username, roleId } = req.body;
        try {
            const currentUser = res.locals.currentUser;
            console.log("Datos recibidos para actualizar usuario:", req.body);
            //validar parametros
            if (!userId || !name || !lastname || !email || !phone || !username || !roleId) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }
            console.log("Validando parámetros para actualizar usuario");
            //validar que name y lastname sean alfabeticos y tenga espacios
            const nameRegex = /^[A-Za-z\s]+$/;
            if (!nameRegex.test(name) || !nameRegex.test(lastname)) {
                return res.status(400).json({ message: "El nombre y apellido solo deben contener letras" });
            }
            //validar que el email tenga formato correcto
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "El email no tiene un formato válido" });
            }

            //validar que el phone tenga formato correcto
            const phoneRegex = /^\+?[0-9]{7,15}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: "El teléfono no tiene un formato válido" });
            }

            //validar que username tenga al menos 5 caracteres y sin espacios
            if (username.length < 5 || username.includes(' ')) {
                return res.status(400).json({ message: "El username debe tener al menos 5 caracteres y no debe contener espacios" });
            }

            //validar si el usuario existe
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            console.log("Validando existencia de usuario para actualizar usuario");
            //validar si ya existe un usuario con ese username y no sea el mismo usuario
            const existingUserByUsername = await userService.findUserByUsername(username);
            if (existingUserByUsername && existingUserByUsername.USER_ID !== userId) {
                return res.status(409).json({ message: "Ya existe un usuario con ese username" });
            }

            //validar si ya existe un usuario con ese email y no sea el mismo usuario
            const existingUserByEmail = await userService.findUserByEmail(email);
            if (existingUserByEmail && existingUserByEmail.USER_ID !== userId) {
                return res.status(409).json({ message: "Ya existe un usuario con ese email" });
            }

            //validar que roleId exista
            const role = await roleService.findRoleById(roleId);
            if (!role) {
                return res.status(400).json({ message: "No existe el rol seleccionado" });
            }

            console.log("Actualizando usuario");
            const result = await userService.updateUser(currentUser.userId, { userId: userId, name, lastname, email, phone, username, roleId });
            if (result) {
                res.status(200).json({ message: "Usuario actualizado exitosamente" });
            }
            else {
                res.status(500).json({ message: "No fue posible actualizar el usuario, favor intente más tarde" });
            }

        } catch (error) {
            console.error("Error en el proceso de actualización de usuario:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de actualización de usuario", error: error.message });
        }
    }


    deleteUser = async (req: Request, res: Response) => {
        const { userId } = req.body;
        try {
            const currentUser = res.locals.currentUser;
            console.log("Datos recibidos para eliminar usuario:", req.body);
            //validar parametros
            if (!userId) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }

            //validar si el usuario existe
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            console.log("Eliminando usuario");
            const result = await userService.deleteUser(userId, currentUser.userId);
            if (result) {
                res.status(200).json({ message: "Usuario eliminado exitosamente" });
            }
            else {
                res.status(500).json({ message: "No fue posible eliminar el usuario, favor intente más tarde" });
            }

        } catch (error) {
            console.error("Error en el proceso de eliminación de usuario:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de eliminación de usuario", error: error.message });
        }
    }


    resetPassword = async (req: Request, res: Response) => {
        const { userId } = req.body;
        try {
            const currentUser = res.locals.currentUser;
            console.log("Datos recibidos para reiniciar contraseña:", req.body);
            //validar parametros
            if (!userId) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }
            //validar si el usuario existe
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            console.log("Reiniciando contraseña de usuario");
            const result = await userService.resetPassword(userId, currentUser.userId, user.username, user.email, req.headers['authorization']?.split(' ')[1]);
            if (result === 1) {
                res.status(200).json({ message: "Contraseña reiniciada exitosamente" });
            }
            if (result === 0) {
                res.status(500).json({ message: "No fue posible reiniciar la contraseña, favor intente más tarde" });
            }
            if (result === -1) {
                res.status(500).json({ message: "Contraseña reiniciada pero no fue posible enviar el correo de notificación" });
            }
        } catch (error) {
            console.error("Error en el proceso de reinicio de contraseña de usuario:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de reinicio de contraseña de usuario", error: error.message });
        }

    }


    
}
