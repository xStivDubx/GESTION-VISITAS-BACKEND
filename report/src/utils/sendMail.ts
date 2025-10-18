import axios from 'axios';
import { ConfigService } from './../services/config.service';


export async function sendMail(emailReceptor: string, token:string,subject:string, body:string) {

    try {
        const configService = new ConfigService();
        const emailUser = await configService.getConfig('SEND_MAIL_EMAIL');
        const emailPass = await configService.getConfig('SEND_MAIL_PASSWORD_APP');
        const endpoint = await configService.getConfig('SEND_MAIL_ENDPOINT');

        

        await axios.post(endpoint, {
            "sendMail": emailUser,
            "mailPassword": emailPass,
            "emailReceptor": emailReceptor,
            "subject": subject,
            "body": body
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return true;
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return false;
    }
    



}