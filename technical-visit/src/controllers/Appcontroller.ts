import { Request, Response } from 'express';
import { VisitService } from '../services/visit.service';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';
import { sendMail } from '../utils/sendMail';
import { config } from 'dotenv';

const visitService = new VisitService();
const authService = new AuthService();
const configService = new ConfigService();
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

    async updateStatusInitVisit(req: Request, res: Response): Promise<Response> {
        try {
            const { visitId } = req.body;
            if (!visitId ) {
                return res.status(400).json({ message: "Faltan campos obligatorios" });
            }
            console.log("ingresando al metodo de updateStatusVisit");
            //validar que la visita tecnica exista
            console.log("validando que la visita tecnica exista");
            const existingVisitById = await visitService.getVisitById(visitId);
            if (!existingVisitById) {
                return res.status(404).json({ message: `No existe la visita tecnica con ID '${visitId}'` });
            }

             let statusValidate = await configService.getConfig('STATUS_ALLOWED_INIT');
            if (!statusValidate) {
                console.log("No se encontró la configuración STATUS_ALLOWED_INIT, se usará el estado por defecto '2'");
                statusValidate = '2'; //por defecto solo el estado 2 - en progreso
            }
            if (!statusValidate.includes(existingVisitById.statusId)) {
                return res.status(200).json({ message: `La visita técnica ya ha sido iniciada o finalizada, no se puede volver a iniciar` });
            }
            //actualizar el estado de la visita tecnica
            console.log("actualizando el estado de la visita tecnica");
            const resultUpdate = await visitService.updateStatusVisitToInProgress(visitId);
            if (!resultUpdate) {
                return res.status(500).json({ message: "No fue posible actualizar el estado de la visita técnica" });
            }
            console.log("Estado de la visita técnica actualizado exitosamente");
            return res.status(200).json({ message: "La visita técnica ha sido iniciada exitosamente" });
        } catch (error) {
            console.error("Error en updateStatusVisit:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }

    }

    async operationCheckInVisit(req: Request, res: Response): Promise<Response> {
        try {
            console.log("ingresando al metodo de operationCheckInVisit");

            const { visitId, technicianId, latitude, longitude } = req.body;

            console.log("Validando campos obligatorios");
            if (!visitId || !technicianId || !latitude || !longitude) {
                return res.status(400).json({ message: "Faltan campos obligatorios" });
            }

            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (isNaN(lat) || lat < -90 || lat > 90) {
                return res.status(400).json({ message: "Latitud inválida" });
            }
            if (isNaN(lon) || lon < -180 || lon > 180) {
                return res.status(400).json({ message: "Longitud inválida" });
            }

            //validar que la visita tecnica exista
            console.log("validando que la visita tecnica exista");
            const existingVisitById = await visitService.getVisitById(visitId);
            if (!existingVisitById) {
                return res.status(404).json({ message: `No existe la visita tecnica con ID '${visitId}'` });
            }

            //validar estado de la visita tecnica
            console.log("validando estado de la visita tecnica");
            let statusValidate = await configService.getConfig('STATUS_ALLOWED_CHECKIN');
            if (!statusValidate) {
                console.log("No se encontró la configuración STATUS_ALLOWED_CHECKIN, se usará el estado por defecto '1'");
                statusValidate = '1'; //por defecto solo el estado 1 - asignada
            }
            if (!statusValidate.includes(existingVisitById.statusId)) {
                return res.status(400).json({ message: `No es posible realizar checkIn, debido a que tiene un estado '${existingVisitById.statusDescription}'` });
            }

            //validar que el tecnico tenga asignada la visita tecnica
            console.log("validando que el tecnico tenga asignada la visita tecnica");
            if (existingVisitById.technicianId !== technicianId) {
                return res.status(400).json({ message: `El tecnico con ID '${technicianId}' no tiene asignada la visita tecnica con ID '${visitId}'` });
            }

            //validar que no exista un check-in previo
            console.log("validando que no exista un check-in previo");
            const existsCheckIn = await visitService.validateCheckInExists(visitId);
            if (existsCheckIn) {
                return res.status(400).json({ message: `Ya existe un check-in para la visita técnica '${existsCheckIn.NAME}'` });
            }

            //generar check-in
            console.log("generando check-in de la visita tecnica");
            const resultCheckIn = await visitService.checkInVisit(visitId, lat, lon);
            if (!resultCheckIn) {
                return res.status(500).json({ message: "No fue posible realizar el check-in" });
            }

            console.log("Check-in generado exitosamente");




            return res.status(200).json({ message: "Check-in generado exitosamente" });
        } catch (error) {
            console.error("Error en operationCheckInVisit:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }


    async operationCheckOutVisit(req: Request, res: Response): Promise<Response> {
        try {
            console.log("ingresando al metodo de operationCheckOutVisit");
            const { visitId, technicianId, latitude, longitude, resume, materialsUsed } = req.body;
            console.log("Validando campos obligatorios");
            if (!visitId || !technicianId || !latitude || !longitude || !resume) {
                return res.status(400).json({ message: "Faltan campos obligatorios" });
            }
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);
            if (isNaN(lat) || lat < -90 || lat > 90) {
                return res.status(400).json({ message: "Latitud inválida" });
            }
            if (isNaN(lon) || lon < -180 || lon > 180) {
                return res.status(400).json({ message: "Longitud inválida" });
            }
            //validar que la visita tecnica exista
            console.log("validando que la visita tecnica exista");
            const existingVisitById = await visitService.getVisitById(visitId);
            if (!existingVisitById) {
                return res.status(404).json({ message: `No existe la visita tecnica con ID '${visitId}'` });
            }
            //validar estado de la visita tecnica
            console.log("validando estado de la visita tecnica");
            let statusValidate = await configService.getConfig('STATUS_ALLOWED_CHECKOUT');
            if (!statusValidate) {
                console.log("No se encontró la configuración STATUS_ALLOWED_CHECKOUT, se usará el estado por defecto '2'");
                statusValidate = '2'; //por defecto solo el estado 2 - en progreso
            }
            if (!statusValidate.includes(existingVisitById.statusId)) {
                return res.status(400).json({ message: `No es posible realizar check-out, debido a que tiene un estado '${existingVisitById.statusDescription}'` });
            }
            //validar que el tecnico tenga asignada la visita tecnica
            console.log("validando que el tecnico tenga asignada la visita tecnica");
            if (existingVisitById.technicianId !== technicianId) {
                return res.status(400).json({ message: `El tecnico con ID '${technicianId}' no tiene asignada la visita tecnica con ID '${visitId}'` });
            }
            //validar que exista un check-in previo
            console.log("validando que exista un check-in previo");
            const existsCheckIn = await visitService.validateCheckInExists(visitId);
            if (!existsCheckIn) {
                return res.status(400).json({ message: `No existe un check-in para la visita técnica '${existingVisitById.NAME}'` });
            }
            //validar que no exista un check-out previo
            console.log("validando que no exista un check-out previo");
            if (existsCheckIn.CHECKOUT_DATETIME) {
                return res.status(400).json({ message: `Ya existe un check-out para la visita técnica '${existingVisitById.NAME}'` });
            }
            //generar check-out
            console.log("generando check-out de la visita tecnica");
            const resultCheckOut = await visitService.checkOutVisit(visitId, lat, lon, resume, materialsUsed);
            if (!resultCheckOut) {
                return res.status(500).json({ message: "No fue posible realizar el check-out" });
            }
            console.log("Check-out generado exitosamente");


            //enviar correo 

            //recuperar el cliente de la visita tecnica
            const client = await visitService.getClientByVisitId(visitId);
            if (!client) {
                console.log(`No fue posible recuperar el cliente de la visita tecnica con ID '${visitId}'`);
                return res.status(200).json({ message: "Check-out generado exitosamente, pero no fue posible enviar el correo al cliente" });
            }

            //enviar correo al cliente
            console.log("enviando correo al cliente");
            const emailReceptor = client.EMAIL;
            const token = req.headers['authorization']?.split(' ')[1];
            let body = await configService.getConfig('MAIL_RESUME_VISIT_BODY_CLIENT');
            const subject = await configService.getConfig('MAIL_RESUME_VISIT_SUBJECT_CLIENT');


            body = body?.replace('{clientName}', client.NAME);
            body = body?.replace('{siteName}', client.SITE_NAME);
            body = body?.replace('{visitId}', visitId);
            body = body?.replace('{supervisorName}', existingVisitById.supervisorName);
            body = body?.replace('{technicianName}', existingVisitById.technicianName);
            body = body?.replace('{resume}', resume);
            body = body?.replace('{materialsUsed}', materialsUsed || 'No se registraron materiales utilizados');
            body = body?.replace('{dateVisit}', existingVisitById.visitDate);

            const mailSent = await sendMail(emailReceptor, token!, subject!, body!);
            if (!mailSent) {
                console.log("No fue posible enviar el correo al cliente");
                return res.status(200).json({ message: "Check-out generado exitosamente, pero no fue posible enviar el correo al cliente" });
            }

            return res.status(200).json({ message: "Check-out generado exitosamente, se envió el correo al cliente" });
        } catch (error) {
            console.error("Error en operationCheckOutVisit:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }











}
