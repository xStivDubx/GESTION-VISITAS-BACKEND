import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { RoleService } from '../services/role.service';
import { ConfigService } from '../services/config.service';
import ExcelJS from 'exceljs';

const reportService = new ReportService();
const roleService = new RoleService();
const configService = new ConfigService();

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







}
