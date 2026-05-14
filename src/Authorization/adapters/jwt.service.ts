import jwt from "jsonwebtoken";
import {appConfig} from "../../core/settings/config";



export const jwtService = {

        async createToken(userId: string, deviceId: string): Promise<string> {
            return jwt.sign({ userId, deviceId }, appConfig.AC_SECRET, {
                expiresIn: '10s', // по Swagger тестовый режим
            });
        },
    async createRefreshToken(userId: string, deviceId: string): Promise<string> {
        return jwt.sign(
            { userId, deviceId },
            appConfig.AC_SECRET,   // можно вынести отдельный REFRESH_SECRET позже
            { expiresIn: '20s' }   // по требованиям тестов
        );
    },

    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },

    async verifyToken(token: string): Promise<{ userId: string; deviceId: string } | null> {
        try {
            const payload = jwt.verify(token, appConfig.AC_SECRET) as any;

            if (!payload || !payload.userId || !payload.deviceId) {
                console.error("JWT payload missing userId or deviceId");
                return null;
            }

            return {
                userId: payload.userId,
                deviceId: payload.deviceId
            };
        } catch (error) {
            console.error("Token verify error:", error);
            return null;
        }
    },
};
