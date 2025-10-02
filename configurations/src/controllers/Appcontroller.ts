import { Request, Response } from 'express';
import { ConfigService } from '../services/config.service';

const configService = new ConfigService();
export class AppController {




    async getAllConfigs(req: Request, res: Response): Promise<Response> {
        try {
            const configs = await configService.getAllConfigs();
            return res.status(200).json({ data: configs });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener las configuraciones",
                error: error.message
            });
        }
    }

    async getConfigById(req: Request, res: Response): Promise<Response> {
        const configId = parseInt(req.params.id, 10);
        try {
            const config = await configService.getConfigById(configId);
            if (!config) {
                return res.status(404).json({ message: "Rol no encontrado" });
            }
            return res.status(200).json({ data: config });
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener el rol",
                error: error.message
            });
        }
    }


    async updateConfig(req: Request, res: Response): Promise<Response> {
        const { configId, value, description } = req.body;

        try {
            const currentUser = res.locals.currentUser;

            if (!value || !description) {
                return res.status(400).json({ message: "Faltan parámetros obligatorios" });
            }

            

            // Verificar si el rol existe
            const existingConfig = await configService.getConfigById(configId);
            if (!existingConfig) {
                return res.status(404).json({ message: "no existe la configuracion a actualizar" });
            }

            const result = await configService.updateConfig(configId, value, description, currentUser.userId);
            if (!result) {
                return res.status(400).json({ message: "Error al actualizar la configuracion" });
            }
            return res.status(200).json({ message: "Configuracion actualizada exitosamente" });
        } catch (error) {
            console.error("Error al actualizar la configuracion:", error);
            return res.status(500).json({
                message: "Error al actualizar la configuracion",
                error: error.message
            });
        }
    }




}
