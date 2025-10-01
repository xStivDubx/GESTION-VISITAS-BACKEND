import { Request, Response } from 'express';
import { VisitService } from '../services/visit.service';

const visitService = new VisitService();

export class AppController {

    //listar tecnicos asignados al supervisor
    async getTechniciansBySupervisor(req: Request, res: Response): Promise<Response> {
        const supervisorId = parseInt(req.params.id, 10);
        if (isNaN(supervisorId)) {
            return res.status(400).json({ message: "ID de supervisor inválido" });
        }
        try {
            console.log("ingresando al metodo de getTechniciansBySupervisor");
            //recuperar el usuario actual del middleware
            const currentUser = res.locals.currentUser;
            console.log("Usuario actual:", currentUser);

            //validar que el rol sea administrado o supervisor
            if (currentUser.roleId !== 1 && currentUser.roleId !== 2) {
                return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
            }


            const technicians = await visitService.getTechniciansBySupervisor(supervisorId);
            return res.status(200).json({ data: technicians });
        } catch (error) {
            console.error("Error al obtener los técnicos:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    // METODO PARA LISTAR CLIENTES ACTIVOS
    async getClientsActive(req: Request, res: Response): Promise<Response> {
        try {
            console.log("ingresando al metodo de getClientsActive");

            const currentUser = res.locals.currentUser;
            console.log("Usuario actual:", currentUser);

            //validar que el rol sea administrado o supervisor
            if (currentUser.roleId !== 1 && currentUser.roleId !== 2) {
                return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
            }

            const clients = await visitService.getClientsActive();
            return res.status(200).json({ data: clients });
        } catch (error) {
            console.error("Error al obtener los clientes activos:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }







}
