import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import ExcelJS from 'exceljs';

const reportService = new ReportService();

export class AppController {




    getReportUsers = async (req: Request, res: Response) => {
        try {

            const users = await reportService.getAllUsers();

            // Crear libro y hoja
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Usuarios');

            // Definir columnas
            sheet.columns = [
                { header: 'ID', key: 'userId', width: 10 },
                { header: 'Nombre', key: 'name', width: 30 },
                { header: 'Apellido', key: 'lastName', width: 30 },
                { header: 'Telefono', key: 'phone', width: 10 },
                { header: 'Correo', key: 'email', width: 30 },
                { header: 'Usuario', key: 'username', width: 20 },
                { header: 'Rol', key: 'roleName', width: 20 },
                { header: 'Supervisor', key: 'supervisorName', width: 30 },
                { header: 'Creado Por', key: 'createdBy', width: 30 },
                { header: 'Fecha de Creación', key: 'createdDate', width: 20 }
            ];

            // Agregar datos
            users.forEach(user => {
                sheet.addRow({
                    userId: user.userId,
                    name: user.name,
                    lastName: user.lastname,
                    phone: user.phone,
                    email: user.email,
                    username: user.username,
                    roleName: user.roleName,
                    supervisorName: user.supervisorName,
                    createdBy: user.createdBy,
                    createdDate: user.createdDate
                });
            });

            // Estilo para encabezado
            const headerRow = sheet.getRow(1);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '4472C4' }
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            const buffer = await workbook.xlsx.writeBuffer();

            // 🔹 Convertir ArrayBuffer → Buffer de Node
            const nodeBuffer = Buffer.from(buffer);

            // 🔹 Convertir a Base64
            const base64 = nodeBuffer.toString('base64');

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader('Content-Disposition', 'attachment; filename="report_users.xlsx"');

            // 🔹 Enviar el contenido codificado en base64
            res.end(base64, 'base64');

        } catch (error) {
            console.error("Error en el proceso de obtención de usuarios:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de obtención de usuarios", error: error.message });
        }
    }

    getReportClients = async (req: Request, res: Response) => {
        try {

            const clients = await reportService.getClients();

            // Crear libro y hoja
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Clientes');

            // Definir columnas (en el mismo orden del SELECT)
            sheet.columns = [
                { header: 'ID Sede', key: 'SITE_ID', width: 10 },
                { header: 'Nombre Sede', key: 'SITE_NAME', width: 30 },
                { header: 'Departamento', key: 'DEPARTMENT', width: 25 },
                { header: 'Municipio', key: 'MUNICIPALITY', width: 25 },
                { header: 'Dirección', key: 'ADDRESS', width: 40 },
                { header: 'Latitud', key: 'LATITUDE', width: 15 },
                { header: 'Longitud', key: 'LONGITUDE', width: 15 },
                { header: 'Actualizado Por (Sede)', key: 'userUpdateSite', width: 30 },
                { header: 'Fecha Creación Sede', key: 'SITE_CREATED_DATE', width: 25 },
                { header: 'Última Actualización Sede', key: 'SITE_LAST_UPDATE', width: 25 },
                { header: 'Cliente', key: 'CLIENT_NAME', width: 30 },
                { header: 'Contacto Cliente', key: 'CLIENT_CONTACT', width: 30 },
                { header: 'Correo Cliente', key: 'CLIENT_EMAIL', width: 30 },
                { header: 'Teléfono Cliente', key: 'CLIENT_PHONE', width: 20 },
                { header: 'Actualizado Por (Cliente)', key: 'userUpdateClient', width: 30 },
                { header: 'Fecha Creación Cliente', key: 'CLIENT_CREATED_DATE', width: 25 },
                { header: 'Última Actualización Cliente', key: 'CLIENT_LAST_UPDATE', width: 25 }
            ];

            // Agregar datos
            clients.forEach(client => {
                sheet.addRow({
                    SITE_ID: client.SITE_ID,
                    SITE_NAME: client.SITE_NAME,
                    DEPARTMENT: client.DEPARTMENT,
                    MUNICIPALITY: client.MUNICIPALITY,
                    ADDRESS: client.ADDRESS,
                    LATITUDE: client.LATITUDE,
                    LONGITUDE: client.LONGITUDE,
                    userUpdateSite: client.userUpdateSite,
                    SITE_CREATED_DATE: client.SITE_CREATED_DATE,
                    SITE_LAST_UPDATE: client.SITE_LAST_UPDATE,
                    CLIENT_NAME: client.CLIENT_NAME,
                    CLIENT_CONTACT: client.CLIENT_CONTACT,
                    CLIENT_EMAIL: client.CLIENT_EMAIL,
                    CLIENT_PHONE: client.CLIENT_PHONE,
                    userUpdateClient: client.userUpdateClient,
                    CLIENT_CREATED_DATE: client.CLIENT_CREATED_DATE,
                    CLIENT_LAST_UPDATE: client.CLIENT_LAST_UPDATE
                });
            });


            // Estilo para encabezado
            const headerRow = sheet.getRow(1);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '4472C4' }
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            const buffer = await workbook.xlsx.writeBuffer();

            // 🔹 Convertir ArrayBuffer → Buffer de Node
            const nodeBuffer = Buffer.from(buffer);

            // 🔹 Convertir a Base64
            const base64 = nodeBuffer.toString('base64');

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader('Content-Disposition', 'attachment; filename="report_clientes.xlsx"');

            // 🔹 Enviar el contenido codificado en base64
            res.end(base64, 'base64');

        } catch (error) {
            console.error("Error en el proceso de obtención de usuarios:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de obtención de usuarios", error: error.message });
        }
    }







}
