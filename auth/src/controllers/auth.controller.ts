import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import bcrypt from "bcryptjs";
import { createToken } from '../utils/jwt';
import { RolePermissionService } from '../services/rolePermission.service';
import { GraphService } from '../services/graph.service';


const userService = new UserService();
const rolePermissionService = new RolePermissionService();
const graphService = new GraphService();

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
            const isValid = await bcrypt.compare(password, user[0].password);
            if (!isValid) {
                res.status(401)
                res.json({ message: "Usuario y/o Contraseña incorrecta" });
                return;
            }

            console.log("generando token");
            const token = createToken(user[0].userId, user[0].roleId);
            const changePassword = user[0].state == 2;
            console.log("changePassword:", changePassword);

            console.log("autenticación exitosa");
            return res.status(200).json({
                message: "Autenticación exitosa",
                data: {
                    username: user[0].username,
                    resetPassword: changePassword,
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
            console.log("Iniciando proceso de cambio de contraseña");
            const { currentPassword, newPassword } = req.body;
            const currentUser = res.locals.currentUser;
            console.log("validando parametros enviados");
            if (!currentPassword || !newPassword) {
                res.status(400);
                res.json({ message: "Parámetros incompletos" });
                return;
            }

            console.log("validando que las contraseñas sean diferentes");
            //validar que sean diferentes
            if (currentPassword === newPassword) {
                res.status(400);
                res.json({ message: "La nueva contraseña debe ser diferente a la actual" });
                return;
            }

            console.log("validando seguridad de la nueva contraseña");
            //validar que la contrseña sea alfanumerica, tenga al menos 8 caracteres, una mayuscula, una minuscula, un caracter especial
            
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_\-.,+/])[A-Za-z\d@$!%*?&#_\-.,+/]{8,}$/;

            if (!passwordRegex.test(newPassword)) {
                res.status(400);
                res.json({ message: "La nueva contraseña no cumple con los requisitos de seguridad. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial." });
                return;
            }


            console.log("buscando usuario en base de datos");
            //buscar el usuario por su id
            const user = await userService.findById(currentUser.userId);
            if (!user) {
                res.status(404);
                res.json({ message: "Usuario no encontrado" });
                return;
            }
            console.log("validando contraseña actual");
            //validar la contraseña actual
            const isValid = await bcrypt.compare(currentPassword, user[0].password);
            if (!isValid) {
                res.status(401)
                res.json({ message: "Contraseña actual incorrecta" });
                return;
            }

            console.log("actualizando contraseña");
            //encriptar la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            //actualizar la contraseña en la base de datos
            const passwordUpdated = await userService.updatePassword(user[0].userId, hashedPassword);

            if (!passwordUpdated) {
                res.status(500);
                res.json({ message: "No se pudo actualizar la contraseña, favor de intentar nuevamente" });
                return;
            }

            console.log("contraseña actualizada correctamente");
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
                    username: user[0].username,
                    role: user[0].roleName,
                    permissions: permissions
                }
            });
        } catch (error) {
            console.error("Error en el proceso de obtención del perfil:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de obtención del perfil", error: error.message });
            return;
        }
    };



    getDataForGraph = async (req: Request, res: Response) => {
        try{

            const currentUser = res.locals.currentUser;

            // buscar permisos del usuario
            const permissions = await rolePermissionService.getAllPermissions(currentUser.roleId);

            if (!permissions) {
                res.status(404);
                res.json({ message: "No se encontraron permisos para el rol" });
                return;
            }

            // validar que tenga el permiso /graph-admin -> que retorne exito1, /graph-supervisor que retorne exito2, /graph-tech -> que retorne exito3, si no tiene, retornar error 403
            const hasGraphAdminPermission = permissions.some(permission => permission.CODE === '/graph-admin');
            const hasGraphSupervisorPermission = permissions.some(permission => permission.CODE === '/graph-supervisor');
            const hasGraphTechPermission = permissions.some(permission => permission.CODE === '/graph-tech');

            if (hasGraphAdminPermission) {
                const data = await graphService.getDataForGraphAdmin();
                return res.status(200).json({ data: data });
            }

            if (hasGraphSupervisorPermission) {
                const data = await graphService.getDataForGraphSupervisor(currentUser.userId);
                return res.status(200).json({ data: data });
            }

            if (hasGraphTechPermission) {
                return res.status(200).json({ data: "exito3" });
            }

            res.status(200).json({ message: "No tiene permisos para visualizar gráficos" });
            return;

        }catch (error) {
            console.error("Error en el proceso de obtención de datos para el gráfico:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de obtención de datos para el gráfico", error: error.message });
            return;
        }
    }

}

