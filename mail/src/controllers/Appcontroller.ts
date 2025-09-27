import { Request, Response } from 'express';
import { ConfigService } from '../services/config.service';
import nodemailer from 'nodemailer';
const configService = new ConfigService();

export class AppController {




    sendMail = async (req: Request, res: Response) => {
        try {
            console.log("Iniciando proceso de envio de correos...");
            const { emailReceptor, subject, body } = req.body;

            console.log("Datos recibidos:", { emailReceptor, subject, body });
            
            if(!emailReceptor || !subject || !body) {
                return res.status(400).json({ message: "Faltan datos en la solicitud" });
            }

            console.log("Obteniendo configuraciones de correo...");
            const smtpUser= await configService.getConfig('SEND_MAIL_EMAIL');
            const smtpPass= await configService.getConfig('SEND_MAIL_PASSWORD_APP');
           

            console.log("configurando el transporte de correo...");
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: smtpUser,
                    pass: smtpPass
                }
            });



            const mailOptions = {
                to: emailReceptor,
                subject: subject,
                text: body
            };


            console.log("Enviando correo a:", emailReceptor);
            const info = await transporter.sendMail(mailOptions);
            //validar que se envio
            if (!info || !info.accepted || info.accepted.length === 0) {
                return res.status(500).json({ message: "Error al enviar el correo" });
            }

            return res.status(200).json({ data: 'El correo fue enviado exitosamente' });
        } catch (error) {
            console.error("Error en el proceso de envio de correos:", error);
            res.status(500).json({ message: "Ocurrió un error en el proceso de envio de correos", error: error.message });
        }
    }

}
