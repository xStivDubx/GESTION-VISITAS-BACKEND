import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';
import { SiteService } from '../services/site.service';

const clientService = new ClientService();
const siteService = new SiteService();


export class AppController {




    async getAllClients(req: Request, res: Response): Promise<Response> {
        try {
            const clients = await clientService.getAllClients();
            return res.status(200).json({ data: clients });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener los clientes",
                error: error.message
            });
        }
    }

    async getClientById(req: Request, res: Response): Promise<Response> {
        const clientId = parseInt(req.params.id, 10);
        try {
            const client = await clientService.findClientById(clientId);
            if (!client) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
            return res.status(200).json({ data: client });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener el cliente",
                error: error.message
            });
        }
    }


    async createClient(req: Request, res: Response): Promise<Response> {
        const { name, concatName, email, phone } = req.body;
        try {
            const currentUser = res.locals.currentUser;

            if (!name || !concatName || !email || !phone) {
                return res.status(400).json({ message: "Faltan datos obligatorios" });
            }

            //VALIDAR que el email tenga un formato correcto
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "El formato del email es incorrecto" });
            }

            //VALIDAR que el teléfono tenga un formato correcto (solo números y entre 7 y 15 dígitos)
            const phoneRegex = /^\d{7,15}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: "El formato del teléfono es incorrecto" });
            }

            const existingClient = await clientService.findClientByName(name);
            if (existingClient) {
                return res.status(409).json({ message: "El cliente ya existe" });
            }

            const result = await clientService.createClient(name, concatName, email, phone, currentUser.userId);
            if (result === 0) {
                return res.status(500).json({ message: "Error al crear el cliente" });
            }
            return res.status(201).json({ message: "Cliente creado exitosamente" });
        } catch (error) {
            console.error("Error al crear el cliente:", error);
            return res.status(500).json({
                message: "Error al crear el cliente",
                error: error.message
            });
        }
    }

    async updateClient(req: Request, res: Response): Promise<Response> {
        const { clientId, name, concatName, email, phone } = req.body;

        try {
            const currentUser = res.locals.currentUser;

            if (!clientId || !name || !concatName || !email || !phone) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }

            //VALIDAR que el email tenga un formato correcto
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "El formato del email es incorrecto" });
            }
            //VALIDAR que el teléfono tenga un formato correcto (solo números y entre 7 y 15 dígitos)
            const phoneRegex = /^\d{7,15}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: "El formato del teléfono es incorrecto" });
            }

            // Verificar si el cliente existe
            const existingClient = await clientService.findClientById(clientId);
            if (!existingClient) {
                return res.status(404).json({ message: "no existe el cliente a actualizar" });
            }

            //validar si ya existe un cliente con el mismo nombre y no es el mismo cliente que se va a actualizar
            const clientWithSameName = await clientService.findClientByName(name);
            if (clientWithSameName && clientWithSameName.CLIENT_ID !== clientId) {
                return res.status(409).json({ message: "Ya existe un cliente con el mismo nombre" });
            }

            const result = await clientService.updateCliente(clientId, name, concatName, email, phone, currentUser.userId);
            if (result === 0) {
                return res.status(400).json({ message: "Error al actualizar el cliente" });
            }
            return res.status(200).json({ message: "Cliente actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar el cliente:", error);
            return res.status(500).json({
                message: "Error al actualizar el cliente",
                error: error.message
            });
        }
    }

    async deleteClient(req: Request, res: Response): Promise<Response> {
        const { clientId } = req.body;
        try {
            const currentUser = res.locals.currentUser;
            if (!clientId) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }
            // Verificar si el cliente existe
            const existingClient = await clientService.findClientById(clientId);
            if (!existingClient) {
                return res.status(404).json({ message: "No existe el cliente a eliminar" });
            }
            const result = await clientService.deleteClient(clientId, currentUser.userId);
            if (!result) {
                return res.status(400).json({ message: "Error al eliminar el cliente" });
            }
            return res.status(200).json({ message: "Cliente eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
            return res.status(500).json({
                message: "Error al eliminar el cliente",
                error: error.message
            });
        }
    }


    async getSitesByClientId(req: Request, res: Response): Promise<Response> {
        const clientId = parseInt(req.params.id, 10);
        try {
            const sites = await siteService.getSitesByClientId(clientId);
            return res.status(200).json({ data: sites });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener los sitios del cliente",
                error: error.message
            });
        }
    }


    async getSiteBySiteId(req: Request, res: Response): Promise<Response> {
        const siteId = parseInt(req.params.id, 10);
        try {
            const site = await siteService.getSiteBySiteId(siteId);
            if (!site) {
                return res.status(404).json({ message: "Sede no encontrada" });
            }
            return res.status(200).json({ data: site });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener la sede",
                error: error.message
            });
        }
    }


    async createSite(req: Request, res: Response): Promise<Response> {
        const { clientId, siteName, department, municipality, address, latitude, longitude } = req.body;
        try {
            console.log("ingresando al metodo de create");
            const currentUser = res.locals.currentUser;

            console.log("validando parametros");
            if (!clientId || !siteName || !department || !municipality || !address || !latitude || !longitude) {
                return res.status(400).json({ message: "Faltan datos obligatorios" });
            }

            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (isNaN(lat) || lat < -90 || lat > 90) {
                return res.status(400).json({ message: "Latitud inválida" });
            }
            if (isNaN(lon) || lon < -180 || lon > 180) {
                return res.status(400).json({ message: "Longitud inválida" });
            }

            //validar si el cliente existe
            console.log("validando si existe el cliente");
            const existingClient = await clientService.findClientById(clientId);
            if (!existingClient) {
                return res.status(404).json({ message: "No existe el cliente asociado a la sede" });
            }

            console.log("validando si existe el cliente");
            //validar si ya existe una sede con el mismo nombre para el mismo cliente
            const existingSite = await siteService.findSiteByNameAndClientId(siteName, clientId);
            if (existingSite) {
                return res.status(409).json({ message: "Ya existe una sede con el mismo nombre para este cliente" });
            }

            console.log("creando la sede");
            const result = await siteService.createSite(clientId, siteName, department, municipality, address, lat, lon, currentUser.userId);
            if (result === 0) {
                return res.status(500).json({ message: "Error al crear la sede" });
            }
            return res.status(201).json({ message: "Sede creada exitosamente" });


        } catch (error) {
            console.error("Error al crear la sede:", error);
            return res.status(500).json({
                message: "Error al crear la sede",
                error: error.message
            });
        }
    }


    async updateSite(req: Request, res: Response): Promise<Response> {

        const { siteId, clientId, siteName, department, municipality, address, latitude, longitude } = req.body;
        try {
            console.log("ingresando al metodo de update");
            const currentUser = res.locals.currentUser;

            console.log("validando parametros");
            if (!siteId || !clientId || !siteName || !department || !municipality || !address || !latitude || !longitude) {
                return res.status(400).json({ message: "Faltan datos obligatorios" });
            }

            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (isNaN(lat) || lat < -90 || lat > 90) {
                return res.status(400).json({ message: "Latitud inválida" });
            }
            if (isNaN(lon) || lon < -180 || lon > 180) {
                return res.status(400).json({ message: "Longitud inválida" });
            }

            // Verificar si la sede existe
            console.log("verificando si la sede existe");
            const existingSite = await siteService.getSiteBySiteId(siteId);
            if (!existingSite) {
                return res.status(404).json({ message: "Sede no encontrada" });
            }

            //validar si el cliente existe
            console.log("validando si existe el cliente");
            const existingClient = await clientService.findClientById(clientId);
            if (!existingClient) {
                return res.status(404).json({ message: "No existe el cliente asociado a la sede" });
            }

            //validar si ya existe una sede con el mismo nombre para el mismo cliente y no es la misma sede que se va a actualizar
            console.log("validando si ya existe una sede con el mismo nombre para el mismo cliente");
            const siteWithSameName = await siteService.findSiteByNameAndClientId(siteName, clientId);
            if (siteWithSameName && siteWithSameName.SITE_ID !== siteId) {
                return res.status(409).json({ message: "Ya existe una sede con el mismo nombre para este cliente" });
            }


            console.log("actualizando la sede");
            const result = await siteService.updateSite(siteId, clientId, siteName, department, municipality, address, lat, lon, currentUser.userId);
            if (result === 0) {
                return res.status(500).json({ message: "Error al actualizar la sede" });
            }
            return res.status(200).json({ message: "Sede actualizada exitosamente" });


        } catch (error) {
            console.error("Error al actualizar la sede:", error);
            return res.status(500).json({
                message: "Error al actualizar la sede",
                error: error.message
            });
        }

    }


    async deleteSite(req: Request, res: Response): Promise<Response> {
        const { siteId } = req.body;
        try {
            const currentUser = res.locals.currentUser;
            if (!siteId) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }
            // Verificar si el cliente existe
            const existingSite = await siteService.getSiteBySiteId(siteId);
            if (!existingSite) {
                return res.status(404).json({ message: "No existe la sede a eliminar" });
            }
            const result = await siteService.deleteSite(siteId, currentUser.userId);
            if (!result) {
                return res.status(400).json({ message: "Error al eliminar la sede" });
            }   
            return res.status(200).json({ message: "Sede eliminada exitosamente" });
        } catch (error) {
            console.error("Error al eliminar la sede:", error);
            return res.status(500).json({
                message: "Error al eliminar la sede",
                error: error.message
            });
        }
    }


}
