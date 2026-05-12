"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodemailerService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../core/settings/config");
exports.nodemailerService = {
    sendEmail(email, code, template) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                secure: true, // SSL
                auth: {
                    user: config_1.appConfig.EMAIL,
                    pass: config_1.appConfig.EMAIL_PASS,
                },
            });
            let info = yield transporter.sendMail({
                from: `"Registration Service" <${config_1.appConfig.EMAIL}>`,
                to: email,
                subject: 'Your code is here',
                html: template(code), // html body
            });
            console.log('✅ Email sent successfully!');
            console.log('Message ID:', info.messageId);
            return true;
        });
    },
    catch(error) {
        console.error('❌ Nodemailer ERROR:');
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        console.error('Response:', error.response);
        return false;
    }
};
//# sourceMappingURL=nodemailer.service.js.map