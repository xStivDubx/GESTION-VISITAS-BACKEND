import { Request, Response } from 'express';
import { VisitService } from '../services/visit.service';

const visitService = new VisitService();

export class AppController {

    async getAllTechnicalVisits(req: Request, res: Response): Promise<Response> {
        try {
            console.log("ingresando al metodo de getAllTechnicalVisits");
            //recuperar el usuario actual del middleware
            const currentUser = res.locals.currentUser;
            console.log("Usuario actual:", currentUser);

            if (currentUser.roleId === 2) { //SUPERVISOR
                console.log("listando todas las visitas tecnicas - supervisor");
                const visits = await visitService.getAllTechnicalVisitsBySupervisor(currentUser.userId);
                return res.status(200).json({ data: visits });
            }

            if (currentUser.roleId === 3) { //TECNICO
                console.log("listando todas las visitas tecnicas - tecnico");
                const visits = await visitService.getAllTechnicalVisitsByTechnician(currentUser.userId);
                return res.status(200).json({ data: visits });
            }
            //ADMINISTRADOR - general
            console.log("listando todas las visitas tecnicas - general");
            const clients = await visitService.getAllTechnicalVisitsGeneral();
            return res.status(200).json({ data: clients });
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }


    async getTechnicalVisitById(req: Request, res: Response): Promise<Response> {
        const visitId = parseInt(req.params.id, 10);
        if (isNaN(visitId)) {
            return res.status(400).json({ message: "ID de visita técnica inválido" });
        }
        try {
            console.log("ingresando al metodo de getTechnicalVisitById");
            const visit = await visitService.getVisitById(visitId);
            if (!visit) {
                return res.status(404).json({ message: "Visita técnica no encontrada" });
            }
            return res.status(200).json({ data: visit });
        } catch (error) {
            console.error("Error al obtener la visita técnica:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }








}
