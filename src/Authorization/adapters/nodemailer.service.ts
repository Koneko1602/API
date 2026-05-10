import nodemailer from 'nodemailer';
import { appConfig} from "../../core/settings/config";

export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code: string) => string
    ): Promise<boolean> {
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

        return !!info;
    },
};

