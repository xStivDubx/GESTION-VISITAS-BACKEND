import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { ConfigService } from '../services/config.service';

const userService = new UserService();
const roleService = new RoleService();
const configService = new ConfigService();

export class AppController {




    getReportUsers = async (req: Request, res: Response) => {
        try {

            const users = await userService.getAllUsers();
            return res.status(200).json({ data: users });
        } catch (error) {
            console.error("Error en el proceso de obtención de usuarios:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de obtención de usuarios", error: error.message });
        }
    }

    





}
