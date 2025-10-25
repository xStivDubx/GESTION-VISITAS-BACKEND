import { Request, Response } from 'express';
import { VisitService } from '../services/visit.service';
import { ClientService } from '../services/client.service';
import { sendMail } from "../utils/sendMail";
import { ConfigService } from '../services/config.service';

const visitService = new VisitService();
const clientService = new ClientService();
const configService = new ConfigService();

export class AppController {

    async getSupervisors(req: Request, res: Response): Promise<Response> {
        try {
            console.log("ingresando al metodo de getSupervisors");
            //recuperar el usuario actual del middleware
            const currentUser = res.locals.currentUser;
            console.log("Usuario actual:", currentUser);

            //validar el rol del usuario, si es admin (1) puede ver todos los supervisores
            if (currentUser.roleId == 1) {
                console.log("El usuario es admin, puede ver todos los supervisores");
                const supervisors = await visitService.getSupervisors();
                //validar que tenga supervisores
                if (supervisors.length === 0) {
                    return res.status(404).json({ message: "No se encontraron supervisores" });
                }
                return res.status(200).json({ data: supervisors });

            } else if (currentUser.roleId == 2) {
                console.log("El usuario es supervisor, puede ver solo su información");
                //si es supervisor (2) puede ver solo su informacion
                const supervisors = await visitService.getSupervisorsById(currentUser.userId);
                if (supervisors.length === 0) {
                    return res.status(404).json({ message: "No se encontró supervisores" });
                }
                return res.status(200).json({ data: supervisors });
            }
            return res.status(403).json({ message: "No tienes permiso para ver los supervisores" });

        } catch (error) {
            console.error("Error al obtener los supervisores:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }


    async getVisitById(req: Request, res: Response): Promise<Response> {
        const visitId = parseInt(req.params.id, 10);
        try {
            console.log("ingresando al metodo de getVisitById");
            if (isNaN(visitId)) {
                return res.status(400).json({ message: "ID de visita inválido" });
            }
            const visit = await visitService.getVisitById(visitId);
            if (!visit) {
                return res.status(404).json({ message: `No se encontró la visita técnica con ID ${visitId}` });
            }
            return res.status(200).json({ data: visit });
        } catch (error) {
            console.error("Error al obtener la visita técnica:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

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



            const technicians = await visitService.getTechniciansBySupervisor(supervisorId);

            //validar que tenga tecnicos asignados
            if (technicians.length === 0) {
                return res.status(404).json({ message: "No se encontraron técnicos asignados a este supervisor" });
            }
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


            const clients = await clientService.getClientsActive();

            //validar que tenga clientes activos
            if (clients.length === 0) {
                return res.status(404).json({ message: "No se encontraron clientes activos" });
            }

            return res.status(200).json({ data: clients });
        } catch (error) {
            console.error("Error al obtener los clientes activos:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    //listar las sedes activas por cliente
    async getActiveLocationsByClient(req: Request, res: Response): Promise<Response> {

        const clientId = parseInt(req.params.id, 10);
        if (isNaN(clientId)) {
            return res.status(400).json({ message: "ID de cliente inválido" });
        }
        try {
            console.log("ingresando al metodo de getActiveLocationsByClient");
            const locations = await clientService.getActiveLocationsByClient(clientId);
            if (locations.length === 0) {
                return res.status(404).json({ message: "No se encontraron sedes activas para este cliente" });
            }
            return res.status(200).json({ data: locations });
        } catch (error) {
            console.error("Error al obtener las sedes activas por cliente:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    //crear la visita tecnica
    async createVisitTechnical(req: Request, res: Response): Promise<Response> {
        try {
            console.log("ingresando al metodo de createVisitTechnical");
            const { name, description, siteId, supervisorId, technicianId, visitDate, plannedStart, plannedEnd, comment } = req.body;

            //validar que los campos obligatorios esten presentes
            if (!name || !description || !siteId || !supervisorId || !technicianId || !visitDate || !plannedStart || !plannedEnd || !comment) {
                return res.status(400).json({ message: "Faltan campos obligatorios" });
            }

            //convertir visitDate a formato YYYY-MM-DD fecha
            console.log("validando la fecha de visita tecnica");
            
            // Crear la fecha de forma local para evitar problemas de zona horaria
            const [year, month, day] = visitDate.split('-').map(Number);
            const visitDateObj = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
            
            if (isNaN(visitDateObj.getTime())) {
                return res.status(400).json({ message: "Fecha de visita inválida" });
            }

            //validar que la fecha no se menor o igual a la fecha actual
            // Obtener la fecha actual en zona horaria de Guatemala (GMT-6)
            const now = new Date();
            const guatemalaOffset = -6 * 60; // Guatemala es GMT-6 (en minutos)
            const guatemalaNow = new Date(now.getTime() + (guatemalaOffset * 60 * 1000) + (now.getTimezoneOffset() * 60 * 1000));
            
            // Crear fecha de hoy en Guatemala y normalizarla
            const todayGuatemala = new Date(guatemalaNow.getFullYear(), guatemalaNow.getMonth(), guatemalaNow.getDate());
            
            // Asegurar que visitDateObj también esté a las 00:00:00
            visitDateObj.setHours(0, 0, 0, 0);
            
            // Debug logs para la validación de fecha
            console.log("=== DEBUG VALIDACIÓN DE FECHA ===");
            console.log("Fecha enviada (string):", visitDate);
            console.log("Fecha parseada [year, month-1, day]:", [year, month - 1, day]);
            console.log("visitDateObj creada localmente:", visitDateObj.toString());
            console.log("now UTC:", now.toString());
            console.log("guatemalaNow:", guatemalaNow.toString());
            console.log("todayGuatemala normalizada:", todayGuatemala.toString());
            console.log("visitDateObj.getTime():", visitDateObj.getTime());
            console.log("todayGuatemala.getTime():", todayGuatemala.getTime());
            console.log("visitDateObj < todayGuatemala:", visitDateObj < todayGuatemala);
            console.log("visitDateObj.toDateString():", visitDateObj.toDateString());
            console.log("todayGuatemala.toDateString():", todayGuatemala.toDateString());
            console.log("===============================");

            // Comparar solo las fechas sin considerar la hora
            if (visitDateObj < todayGuatemala) {
                return res.status(400).json({ message: "La fecha de visita no puede ser menor a la fecha actual" });
            }

            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/; // HH:mm o HH:mm:ss

            if (!timeRegex.test(plannedStart) || !timeRegex.test(plannedEnd)) {
                return res.status(400).json({
                    message: 'El formato de hora debe ser HH:mm o HH:mm:ss (por ejemplo, 09:00 o 14:30:00).'
                });
            }

            // Convertimos a minutos para comparar
            const [startH, startM] = plannedStart.split(':').map(Number);
            const [endH, endM] = plannedEnd.split(':').map(Number);
            const startMinutes = startH * 60 + startM;
            const endMinutes = endH * 60 + endM;

            //validar que la hora inicio no sea menor o igual a la hora actual si la fecha es igual a la actual
            // Ya tenemos guatemalaNow y todayGuatemala de la validación anterior
            const currentMinutes = guatemalaNow.getHours() * 60 + guatemalaNow.getMinutes();
            
            // Debug logs para identificar el problema
            console.log("=== DEBUG VALIDACIÓN DE HORA (CREATE) ===");
            console.log("Fecha de visita:", visitDateObj.toDateString());
            console.log("Fecha actual Guatemala:", todayGuatemala.toDateString());
            console.log("Hora actual UTC:", now.toString());
            console.log("Hora actual Guatemala:", guatemalaNow.toString());
            console.log("Zona horaria del servidor:", Intl.DateTimeFormat().resolvedOptions().timeZone);
            console.log("Hora actual Guatemala (HH:mm):", `${guatemalaNow.getHours()}:${guatemalaNow.getMinutes().toString().padStart(2, '0')}`);
            console.log("Hora de inicio programada:", plannedStart);
            console.log("Minutos actuales (Guatemala):", currentMinutes);
            console.log("Minutos de inicio:", startMinutes);
            console.log("¿Es el mismo día?:", visitDateObj.toDateString() === todayGuatemala.toDateString());
            console.log("¿startMinutes <= currentMinutes?:", startMinutes <= currentMinutes);
            console.log("=======================================");
            
            if (visitDateObj.toDateString() === todayGuatemala.toDateString() && startMinutes <= currentMinutes) {
                return res.status(400).json({ 
                    message: `La hora de inicio (${plannedStart}) no puede ser menor o igual a la hora actual de Guatemala (${guatemalaNow.getHours()}:${guatemalaNow.getMinutes().toString().padStart(2, '0')})` 
                });
            }


            if (endMinutes <= startMinutes) {
                return res.status(400).json({
                    message: 'La hora de fin debe ser posterior a la hora de inicio.'
                });
            }

            //debe de haber al menos 30 minutos de diferencia entre la hora de inicio y fin
            if (endMinutes - startMinutes < 30) {
                return res.status(400).json({
                    message: 'Debe haber al menos 30 minutos de diferencia entre la hora de inicio y fin.'
                });
            }

            //VALIDAR SI LA SEDE Y EL CLIENTE ESTAN ACTIVOS
            console.log("validando si la sede y el cliente estan activos");
            const client = await clientService.getClientByLocation(siteId);
            if (!client) {
                return res.status(400).json({ message: "La sede no está activa o no existe, favor verificar" });
            }

            //validar si el tecnico esta activo
            console.log("validando si el tecnico esta activo ");
            const technician = await visitService.validateTechnicianActive(technicianId);
            if (!technician) {
                return res.status(400).json({ message: "El técnico no está activo o no existe, favor verificar" });
            }


            //validar si ya existe una visita tecnica con el mismo nombre para el mismo supervisor
            console.log("validando si ya existe una visita tecnica con el mismo nombre para el mismo supervisor");
            const existingVisitByName = await visitService.getVisitByName(name, supervisorId);
            if (existingVisitByName) {
                return res.status(409).json({ message: `Ya existe una visita tecnica con el nombre '${name}' para el supervisor.` });
            }

            //validar si ya existe una visita tecnica para el mismo tecnico en la misma fecha
            console.log("validando si ya existe una visita tecnica para el mismo tecnico en la misma fecha");
            const existingVisit = await visitService.getVisitByTechnicianAndDate(technicianId, visitDate, plannedStart, plannedEnd);
            if (existingVisit) {
                return res.status(409).json({ message: `El tecnico ya tiene programada la visita tecnica '${existingVisit.NAME}', para la fecha '${visitDate}' y el rango horario '${existingVisit.PLANNED_START_TIME} - ${existingVisit.PLANNED_END_TIME}', debe dejar 1 hora de diferencia.` });
            }

            //crear la visita tecnica
            console.log("creando la visita tecnica");
            const resultInsert = await visitService.createVisitTechnical(name, description, siteId, supervisorId, technicianId, visitDate, comment, plannedStart, plannedEnd);

            if (resultInsert === 0) {
                return res.status(500).json({ message: "No fue posible crear la visita tecnica, favor de intentar nuevamente" });
            }

            console.log("Visita tecnica creada exitosamente");
            //enviar correo al cliente notificando la creacion de la visita tecnica - pendiente

            const emailReceptor = client.email;
            const token = req.headers['authorization']?.split(' ')[1];
            let body = await configService.getConfig('MAIL_CREATE_VISIT_BODY_CLIENT');
            const subject = await configService.getConfig('MAIL_CREATE_VISIT_SUBJECT_CLIENT');

            body = body?.replaceAll('{clientName}', client.client_name);
            body = body?.replaceAll('{siteName}', client.site_name);
            body = body?.replaceAll('{visitDate}', visitDate);
            body = body?.replaceAll('{technicianName}', technician.name + ' ' + technician.lastname);
            body = body?.replaceAll('{processDescription}', description);

            const emailSent = await sendMail(emailReceptor, token!, subject!, body!);
            if (!emailSent) {
                return res.status(200).json({ message: "Visita tecnica creada exitosamente. Sin embargo, no fue posible enviar el correo de notificación al cliente." });
            }


            return res.status(201).json({ message: "Visita tecnica creada exitosamente, fue enviada la notificación al cliente." });

        } catch (error) {
            console.error("Error al crear la visita tecnica:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }


    //actualizar la visita tecnica 
    async updateVisitTechnical(req: Request, res: Response): Promise<Response> {
        try {
            console.log("ingresando al metodo de updateVisitTechnical");
            const { visitId, name, description, siteId, supervisorId, technicianId, visitDate, comment, plannedStart, plannedEnd } = req.body;

            //validar que los campos obligatorios esten presentes
            if (!visitId || !name || !description || !siteId || !supervisorId || !technicianId || !visitDate || !comment || !plannedStart || !plannedEnd) {
                return res.status(400).json({ message: "Faltan campos obligatorios" });
            }

            //convertir visitDate a formato YYYY-MM-DD fecha
            console.log("validando la fecha de visita tecnica");
            
            // Crear la fecha de forma local para evitar problemas de zona horaria (Guatemala GMT-6)
            const [year, month, day] = visitDate.split('-').map(Number);
            const visitDateObj = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
            
            if (isNaN(visitDateObj.getTime())) {
                return res.status(400).json({ message: "Fecha de visita inválida" });
            }

            //validar que la fecha no se menor o igual a la fecha actual
            // Obtener la fecha actual en zona horaria de Guatemala (GMT-6)
            const nowUpdate = new Date();
            const guatemalaOffsetUpdate = -6 * 60; // Guatemala es GMT-6 (en minutos)
            const guatemalaNowUpdate = new Date(nowUpdate.getTime() + (guatemalaOffsetUpdate * 60 * 1000) + (nowUpdate.getTimezoneOffset() * 60 * 1000));
            
            // Crear fecha de hoy en Guatemala y normalizarla
            const todayGuatemalaUpdate = new Date(guatemalaNowUpdate.getFullYear(), guatemalaNowUpdate.getMonth(), guatemalaNowUpdate.getDate());
            
            // Asegurar que visitDateObj también esté a las 00:00:00
            visitDateObj.setHours(0, 0, 0, 0);
            
            // Debug logs para la validación de fecha
            console.log("=== DEBUG VALIDACIÓN DE FECHA (UPDATE) ===");
            console.log("Fecha enviada (string):", visitDate);
            console.log("Fecha parseada [year, month-1, day]:", [year, month - 1, day]);
            console.log("visitDateObj creada localmente:", visitDateObj.toString());
            console.log("nowUpdate UTC:", nowUpdate.toString());
            console.log("guatemalaNowUpdate:", guatemalaNowUpdate.toString());
            console.log("todayGuatemalaUpdate normalizada:", todayGuatemalaUpdate.toString());
            console.log("visitDateObj.getTime():", visitDateObj.getTime());
            console.log("todayGuatemalaUpdate.getTime():", todayGuatemalaUpdate.getTime());
            console.log("visitDateObj < todayGuatemalaUpdate:", visitDateObj < todayGuatemalaUpdate);
            console.log("visitDateObj.toDateString():", visitDateObj.toDateString());
            console.log("todayGuatemalaUpdate.toDateString():", todayGuatemalaUpdate.toDateString());
            console.log("=======================================");

            // Comparar solo las fechas sin considerar la hora
            if (visitDateObj < todayGuatemalaUpdate) {
                return res.status(400).json({ message: "La fecha de visita no puede ser menor a la fecha actual" });
            }

            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/; // HH:mm o HH:mm:ss

            if (!timeRegex.test(plannedStart) || !timeRegex.test(plannedEnd)) {
                return res.status(400).json({
                    message: 'El formato de hora debe ser HH:mm o HH:mm:ss (por ejemplo, 09:00 o 14:30:00).'
                });
            }

            // Convertimos a minutos para comparar
            const [startH, startM] = plannedStart.split(':').map(Number);
            const [endH, endM] = plannedEnd.split(':').map(Number);
            const startMinutes = startH * 60 + startM;
            const endMinutes = endH * 60 + endM;

            //validar que la hora inicio no sea menor o igual a la hora actual si la fecha es igual a la actual
            // Ya tenemos guatemalaNowUpdate y todayGuatemalaUpdate de la validación anterior
            const currentMinutesUpdate = guatemalaNowUpdate.getHours() * 60 + guatemalaNowUpdate.getMinutes();
            
            // Debug logs para identificar el problema
            console.log("=== DEBUG VALIDACIÓN DE HORA (UPDATE) ===");
            console.log("Fecha de visita:", visitDateObj.toDateString());
            console.log("Fecha actual Guatemala:", todayGuatemalaUpdate.toDateString());
            console.log("Hora actual UTC:", nowUpdate.toString());
            console.log("Hora actual Guatemala:", guatemalaNowUpdate.toString());
            console.log("Zona horaria del servidor:", Intl.DateTimeFormat().resolvedOptions().timeZone);
            console.log("Hora actual Guatemala (HH:mm):", `${guatemalaNowUpdate.getHours()}:${guatemalaNowUpdate.getMinutes().toString().padStart(2, '0')}`);
            console.log("Hora de inicio programada:", plannedStart);
            console.log("Minutos actuales (Guatemala):", currentMinutesUpdate);
            console.log("Minutos de inicio:", startMinutes);
            console.log("¿Es el mismo día?:", visitDateObj.toDateString() === todayGuatemalaUpdate.toDateString());
            console.log("¿startMinutes <= currentMinutesUpdate?:", startMinutes <= currentMinutesUpdate);
            console.log("=======================================");
            
            if (visitDateObj.toDateString() === todayGuatemalaUpdate.toDateString() && startMinutes <= currentMinutesUpdate) {
                return res.status(400).json({ 
                    message: `La hora de inicio (${plannedStart}) no puede ser menor o igual a la hora actual de Guatemala (${guatemalaNowUpdate.getHours()}:${guatemalaNowUpdate.getMinutes().toString().padStart(2, '0')})` 
                });
            }


            if (endMinutes <= startMinutes) {
                return res.status(400).json({
                    message: 'La hora de fin debe ser posterior a la hora de inicio.'
                });
            }

            //debe de haber al menos 30 minutos de diferencia entre la hora de inicio y fin
            if (endMinutes - startMinutes < 30) {
                return res.status(400).json({
                    message: 'Debe haber al menos 30 minutos de diferencia entre la hora de inicio y fin.'
                });
            }

            //validar si ya existe la visita tecnica por ID
            const existingVisitById = await visitService.getVisitById(visitId);
            if (!existingVisitById) {
                return res.status(404).json({ message: `No existe la visita tecnica con ID '${visitId}'` });
            }

            //validar que solo se pueda actualizar con estado 1 

            //validar que solo se pueda actualizar con estados:
            let statusValidate = await configService.getConfig('STATUS_ALLOWED_FOR_UPDATE');
            if (!statusValidate) {
                return res.status(500).json({ message: "No fue posible validar el estado de la visita tecnica, favor de intentar nuevamente" });
            }
            if (!statusValidate.includes(existingVisitById.STATUS)) {
                return res.status(400).json({ message: `No es posible actualizar la visita técnica, por el estado en el que se encuentra.` });
            }



            //VALIDAR SI LA SEDE Y EL CLIENTE ESTAN ACTIVOS
            console.log("validando si la sede y el cliente estan activos");
            const client = await clientService.getClientByLocation(siteId);
            if (!client) {
                return res.status(400).json({ message: "La sede no está activa o no existe, favor verificar" });
            }

            //validar si el tecnico esta activo
            console.log("validando si el tecnico esta activo ");
            const technician = await visitService.validateTechnicianActive(technicianId);
            if (!technician) {
                return res.status(400).json({ message: "El técnico no está activo o no existe, favor verificar" });
            }


            //validar si ya existe una visita tecnica con el mismo nombre para el mismo supervisor y diferente ID de visita
            console.log("validando si ya existe una visita tecnica con el mismo nombre para el mismo supervisor");
            const existingVisitByName = await visitService.getVisitByName(name, supervisorId);
            if (existingVisitByName && existingVisitByName.visit_id !== visitId) {
                return res.status(409).json({ message: `Ya existe una visita tecnica con el nombre '${name}' para el supervisor.` });
            }

            //validar si ya existe una visita tecnica para el mismo tecnico en la misma fecha y diferente ID de visita
            console.log("validando si ya existe una visita tecnica para el mismo tecnico en la misma fecha");
            const existingVisit = await visitService.getVisitByTechnicianAndDate(technicianId, visitDate, plannedStart, plannedEnd);
            if (existingVisit && existingVisit.VISIT_ID !== visitId) {
                return res.status(409).json({ message: `El tecnico ya tiene programada la visita tecnica '${existingVisit.NAME}', para la fecha '${visitDate}' y el rango horario '${existingVisit.PLANNED_START_TIME} - ${existingVisit.PLANNED_END_TIME}', debe dejar 1 hora de diferencia.` });
            }

            //actualizar la visita tecnica
            console.log("actualizando la visita tecnica");
            const resultUpdate = await visitService.updateVisitTechnical(visitId, name, description, siteId, supervisorId, technicianId, visitDate, comment, plannedStart, plannedEnd);
            if (resultUpdate === 0) {
                return res.status(500).json({ message: "No fue posible actualizar la visita tecnica, favor de intentar nuevamente" });
            }
            console.log("Visita tecnica actualizada exitosamente");

            //enviar correo al cliente notificando la creacion de la visita tecnica - pendiente

            console.log("enviando correo de notificacion al cliente sobre la actualizacion de la visita tecnica");
            const emailReceptor = client.email;
            const token = req.headers['authorization']?.split(' ')[1];
            let body = await configService.getConfig('MAIL_UPDATE_VISIT_BODY_CLIENT');
            const subject = await configService.getConfig('MAIL_UPDATE_VISIT_SUBJECT_CLIENT');

            body = body?.replaceAll('{clientName}', client.client_name);
            body = body?.replaceAll('{siteName}', client.site_name);
            body = body?.replaceAll('{visitDate}', visitDate);
            body = body?.replaceAll('{technicianName}', technician.name + ' ' + technician.lastname);
            body = body?.replaceAll('{processDescription}', description);

            const emailSent = await sendMail(emailReceptor, token!, subject!, body!);
            if (!emailSent) {
                return res.status(200).json({ message: "Visita tecnica actualizada exitosamente. Sin embargo, no fue posible enviar el correo de notificación al cliente." });
            }




            return res.status(200).json({ message: "Visita tecnica actualizada exitosamente" });




        } catch (error) {
            console.error("Error al actualizar la visita tecnica:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    async cancelVisitTechnical(req: Request, res: Response): Promise<Response> {
        try {
            console.log("ingresando al metodo de cancelVisitTechnical");
            const { visitId } = req.body;
            //validar que los campos obligatorios esten presentes
            if (!visitId) {
                return res.status(400).json({ message: "Faltan campos obligatorios" });
            }
            //validar si ya existe la visita tecnica por ID
            const existingVisitById = await visitService.getVisitById(visitId);
            if (!existingVisitById) {
                return res.status(404).json({ message: `No existe la visita tecnica con ID '${visitId}'` });
            }
            //validar que solo se pueda actualizar con estados:
            let statusValidate = await configService.getConfig('STATUS_ALLOWED_FOR_CANCEL_VISIT');
            if (!statusValidate) {
                return res.status(500).json({ message: "No fue posible validar el estado de la visita tecnica, favor de intentar nuevamente" });
            }
            if (!statusValidate.includes(existingVisitById.STATUS)) {
                return res.status(400).json({ message: `No es posible cancelar la visita tecnica, por el estado en el que se encuentra.` });
            }
            //cancelar la visita tecnica
            console.log("cancelando la visita tecnica");
            const resultUpdate = await visitService.updateVisitStatus(visitId, 5);
            if (resultUpdate === 0) {
                return res.status(500).json({ message: "No fue posible cancelar la visita tecnica, favor de intentar nuevamente" });
            }
            console.log("Visita tecnica cancelada exitosamente");

            return res.status(200).json({ message: "Visita tecnica cancelada exitosamente" });
        } catch (error) {
            console.error("Error al cancelar la visita tecnica:", error);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

}
