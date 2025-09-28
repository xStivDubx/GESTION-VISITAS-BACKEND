import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';

const clientService = new ClientService();
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




    
            


}
