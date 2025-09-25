import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import bcrypt from "bcryptjs";
import { createToken } from '../utils/jwt';
import { RolePermissionService } from '../services/rolePermission.service';


const userService = new UserService();

export class AppController {


   

    getAllUsers = async (req: Request, res: Response) => {
        try {
            
            const users = await userService.getAllUsers();
            return res.status(200).json({ data: users });
        }catch (error) {
            console.error("Error en el proceso de obtención de usuarios:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de obtención de usuarios", error: error.message });
        }
    }

    getUserById = async (req: Request, res: Response) => {
        const userId = Number(req.params.id);
        try{
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            return res.status(200).json({ data: user });
        }catch (error) {
            console.error("Error en el proceso de obtención de usuario:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de obtención de usuario", error: error.message });
        }
    }

}

