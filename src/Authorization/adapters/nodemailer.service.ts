import nodemailer from 'nodemailer';
import { appConfig} from "../../core/settings/config";
//
// export const nodemailerService = {
//     async sendEmail(
//         email: string,
//         code: string,
//         template: (code: string) => string
//     ): Promise<boolean> {
//         let transporter = nodemailer.createTransport({
//             service: 'smtp.ethereal.email',
//             auth: {
//                 user: appConfig.EMAIL,
//                 pass: appConfig.EMAIL_PASS,
//             },
//         });
//
//         let info = await transporter.sendMail({
//             from: '"Kek 👻" <codeSender>',
//             to: email,
//             subject: 'Your code is here',
//             html: template(code), // html body
//         });
//
//         return !!info;
//     },
// };
export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code: string) => string
    ): Promise<boolean> {
        try {
            console.log('[EMAIL ATTEMPT] Preparing to send to:', email, 'with code:', code);

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',      // ← обязательно явно host!
                port: 587,                        // ← порт 587 для STARTTLS
                secure: false,                    // НЕ SSL, используем STARTTLS
                auth: {
                    user: appConfig.EMAIL,
                    pass: appConfig.EMAIL_PASS,
                },
                tls: {
                    rejectUnauthorized: false     // часто нужно для тестовых сервисов
                }
            });

            // Проверяем соединение перед отправкой (полезно для дебагга)
            await transporter.verify();
            console.log('[EMAIL] Transporter verified OK');

            const info = await transporter.sendMail({
                from: `"Registration Service" <${appConfig.EMAIL}>`,  // ← правильный формат from
                to: email,
                subject: 'Confirm your registration',
                html: template(code),
            });

            console.log('[EMAIL SUCCESS] Message sent! ID:', info.messageId);
            console.log('[EMAIL PREVIEW] View letter:', nodemailer.getTestMessageUrl(info));  // ← ссылка на письмо в Ethereal

            return true;
        } catch (error) {
            console.error('[EMAIL FAIL] Full error:', error);
            return false;
        }
    },
};
