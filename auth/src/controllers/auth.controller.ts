import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import bcrypt from "bcrypt";
import { createToken } from '../utils/jwt';
const userService = new UserService();

export class AuthController {


    helloWorld = (req: Request, res: Response) => {
        return res.status(200).json({
            message: 'Hola mundo',
            timestamp: new Date().toISOString()
        });
    };


    login = async (req: Request, res: Response) => {

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
            data:{
                username: user.username,
                changePassword: changePassword,
                token: token
            }
        });
    };

    changePassword = async (req: Request, res: Response) => {
        const { currentPassword, newPassword } = req.body;
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






    }


    logout = (req: Request, res: Response) => {
        return res.status(200).json({
            message: 'Hola mundo',
            timestamp: new Date().toISOString()
        });
    };


    profile = (req: Request, res: Response) => {
        return res.status(200).json({
            message: 'Hola mundo',
            timestamp: new Date().toISOString()
        });
    };
}

