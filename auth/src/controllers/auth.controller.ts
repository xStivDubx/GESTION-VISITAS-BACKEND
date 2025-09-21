import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import bcrypt from "bcrypt";
import { createToken } from '../utils/jwt';
import { RolePermissionService } from '../services/rolePermission.service';


const userService = new UserService();
const rolePermissionService = new RolePermissionService();

export class AuthController {


    helloWorld = (req: Request, res: Response) => {
        return res.status(200).json({
            message: 'Hola mundo',
            timestamp: new Date().toISOString()
        });
    };


    login = async (req: Request, res: Response) => {

        try {
            const { username, password } = req.body;

            console.log("validando parametros enviados");
            if (!username || !password) {
                res.status(400);
                res.json({ message: "Usuario y/o Contraseña Incorrecta" });
                return;
            }

            console.log("buscando usuario en base de datos");
            const user = await userService.findByUsername(username);

            if (!user) {
                res.status(401);
                res.json({ message: "Usuario y/o Contraseña Incorrecta" });
                return;
            }

            //const contras = await bcrypt.hash(password, 10);
            //console.log("contraseña:",contras);

            console.log("validando contraseña");
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                res.status(401)
                res.json({ message: "Usuario y/o Contraseña incorrecta" });
                return;
            }

            console.log("generando token");
            const token = createToken(user.userId, user.role.roleId);
            const changePassword = user.state === 2;

            console.log("autenticación exitosa");
            return res.status(200).json({
                message: "Autenticación exitosa",
                data: {
                    username: user.username,
                    changePassword: changePassword,
                    token: token
                }
            });
        } catch (error) {
            console.error("Error en el proceso de login:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de login", error: error.message });
        }

    };

    changePassword = async (req: Request, res: Response) => {

        try {
            const { currentPassword, newPassword } = req.body;
            const currentUser = res.locals.currentUser;
            if (!currentPassword || !newPassword) {
                res.status(400);
                res.json({ message: "Parámetros incompletos" });
                return;
            }

            //validar que sean diferentes
            if (currentPassword === newPassword) {
                res.status(400);
                res.json({ message: "La nueva contraseña debe ser diferente a la actual" });
                return;
            }

            //validar que la contrseña sea alfanumerica, tenga al menos 8 caracteres, una mayuscula, una minuscula, un caracter especial
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                res.status(400);
                res.json({ message: "La nueva contraseña no cumple con los requisitos de seguridad. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial." });
                return;
            }

            console.log(currentUser)

            //buscar el usuario por su id
            const user = await userService.findById(currentUser.userId);
            if (!user) {
                res.status(404);
                res.json({ message: "Usuario no encontrado" });
                return;
            }
            //validar la contraseña actual
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                res.status(401)
                res.json({ message: "Contraseña actual incorrecta" });
                return;
            }

            //encriptar la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            //actualizar la contraseña en la base de datos
            const passwordUpdated = await userService.updatePassword(user.userId, hashedPassword);

            if (!passwordUpdated) {
                res.status(500);
                res.json({ message: "No se pudo actualizar la contraseña, favor de intentar nuevamente" });
                return;
            }


            return res.status(200).json({
                message: "Contraseña actualizada correctamente"
            });
        } catch (error) {
            console.error("Error en el proceso de cambio de contraseña:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de cambio de contraseña", error: error.message });
        }

    }





    profile = async (req: Request, res: Response) => {

        try {
            const currentUser = res.locals.currentUser;

            console.log(currentUser);

            //obtener el usuario de la base de datos
            console.log("Buscando usuario en base de datos");
            const user = await userService.findById(currentUser.userId);

            if (!user) {
                res.status(404);
                res.json({ message: "Usuario no encontrado" });
                return;
            }

            console.log("obteniendo los permisos del usuario");
            const permissions = await rolePermissionService.getPermissionByRoleId(currentUser.roleId);

            if (!permissions) {
                res.status(404);
                res.json({ message: "No se encontraron permisos para el rol" });
                return;
            }
            console.log("retornando datos del perfil");

            return res.status(200).json({
                data: {
                    username: user.username,
                    role: user.role.name,
                    permissions: permissions
                }
            });
        } catch (error) {
            console.error("Error en el proceso de obtención del perfil:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de obtención del perfil", error: error.message });
            return;
        }
    };
}

