import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

export class AppController {




    sendMail = async (req: Request, res: Response) => {
        try {
            console.log("Iniciando proceso de envio de correos...");
            const { sendMail, mailPassword,emailReceptor, subject, body } = req.body;

            console.log("Datos recibidos:", { emailReceptor, subject, body });

            if(!sendMail || !mailPassword || !emailReceptor || !subject || !body) {
                return res.status(400).json({ message: "Faltan datos en la solicitud" });
            }

            console.log("configurando el transporte de correo...");
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: sendMail,
                    pass: mailPassword
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
