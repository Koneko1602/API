
import nodemailer from 'nodemailer';
import { appConfig } from '../../core/settings/config';

export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code: string) => string
    ): Promise<boolean> {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: appConfig.EMAIL,
                pass: appConfig.EMAIL_PASS,
            },
            connectionTimeout: 3000,
            greetingTimeout: 3000,
            socketTimeout: 4000,
        });

        try {
            const info = await transporter.sendMail({
                from: `"Registration Service" <${appConfig.EMAIL}>`,
                to: email,
                subject: 'Your code is here',
                html: template(code),
            });

            console.log('Email sent successfully:', info.messageId);
            return true;
        } catch (error: unknown) {
            console.error('Nodemailer error:', error);
            return false;
        } finally {
            transporter.close();
        }
    },
};
