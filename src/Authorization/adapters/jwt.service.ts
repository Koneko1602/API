import jwt from "jsonwebtoken";
import {appConfig} from "../../core/settings/config";



export const jwtService = {
    async createToken(userId: string): Promise<string> {
        return jwt.sign({ userId }, appConfig.AC_SECRET, {
            expiresIn: '10s', // по Swagger тестовый режим
        });
    },
    async createRefreshToken(userId: string): Promise<string> {
        return jwt.sign({ userId }, appConfig.AC_SECRET, {     // тот же секрет, что и у access
            expiresIn: '20s',
        });
    },

    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },
    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, appConfig.AC_SECRET) as { userId: string };
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    },
};
//. Это типичный сервис для реализации аутентификации и авторизации в приложении.