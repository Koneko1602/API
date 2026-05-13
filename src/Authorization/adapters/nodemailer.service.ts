import nodemailer from 'nodemailer';
import { appConfig} from "../../core/settings/config";

export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code: string) => string
    ): Promise<boolean> {
        try {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: true,  // SSL
                auth: {
                    user: appConfig.EMAIL,
                    pass: appConfig.EMAIL_PASS,
                },
            });
            let info = await transporter.sendMail({
                from: `"Registration Service" <${appConfig.EMAIL}>`,
                to: email,
                subject: 'Your code is here',
                html: template(code), // html body
            });
            console.log('✅ Email sent successfully!');
            console.log('Message ID:', info.messageId);
            return true;
        } catch (error: any) {
            console.error('❌ Nodemailer ERROR:');
            console.error('Code:', error.code);
            console.error('Message:', error.message);
            console.error('Response:', error.response);
            return false;
        }
    }
};
