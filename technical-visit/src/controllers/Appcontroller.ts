import { Request, Response } from 'express';
import { VisitService } from '../services/visit.service';
import { AuthService } from '../services/auth.service';

const visitService = new VisitService();
const authService = new AuthService();

export class AppController {

    async getAllTechnicalVisits(req: Request, res: Response): Promise<Response> {
        try {
            console.log("ingresando al metodo de getAllTechnicalVisits");
            //recuperar el usuario actual del middleware
            const currentUser = res.locals.currentUser;
            console.log("Usuario actual:", currentUser);

            const permissions = await authService.getPermissionByRole(currentUser.roleId);

            //validar que tenga el permiso show-visit-gen para listar todas las visitas tecnicas - administrador general
            const hasGeneralPermission = permissions?.some((perm: any) => perm.CODE === 'show-visit-gen');
            if (hasGeneralPermission) {
                console.log("listando todas las visitas tecnicas - general");
                const visits = await visitService.getAllTechnicalVisitsGeneral();
                return res.status(200).json({ data: visits });
            }


            //validar que tenga el permiso show-visit-sup para listar todas las visitas tecnicas - supervisor
            const hasSupervisorPermission = permissions?.some((perm: any) => perm.CODE === 'show-visit-sup');
            if (hasSupervisorPermission) { //SUPERVISOR
                console.log("listando todas las visitas tecnicas - supervisor");
                const visits = await visitService.getAllTechnicalVisitsBySupervisor(currentUser.userId);
                return res.status(200).json({ data: visits });
            }

            //validar que tenga el permiso show-visit-tec para listar todas las visitas tecnicas - tecnico
            const hasTechnicianPermission = permissions?.some((perm: any) => perm.CODE === 'show-visit-tec');
            if (hasTechnicianPermission) { //TECNICO
                console.log("listando todas las visitas tecnicas - tecnico");
                const visits = await visitService.getAllTechnicalVisitsByTechnician(currentUser.userId);
                return res.status(200).json({ data: visits });
            }
            return res.status(403).json({ message: "No tiene permisos para ver las visitas técnicas" });
        } catch (error) {
            console.error("Error al obtener las visitas técnicas:", error);
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
