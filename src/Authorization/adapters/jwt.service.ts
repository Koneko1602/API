import jwt from "jsonwebtoken";
import {appConfig} from "../../core/settings/config";

/**
 * JwtService - класс для работы с JWT токенами
 * Отвечает за создание, верификацию и декодирование JWT токенов
 * 
 * Паттерн: Adapter Pattern (адаптер над библиотекой jsonwebtoken)
 */
export class JwtService {
    
    /**
     * Создает access token с временем жизни 10 секунд
     * @param userId - ID пользователя
     * @param deviceId - ID устройства
     * @returns JWT токен в виде строки
     */
    async createToken(userId: string, deviceId: string): Promise<string> {
        return jwt.sign(
            { userId, deviceId }, 
            appConfig.AC_SECRET, 
            {
                expiresIn: '10s', // по Swagger тестовый режим
            }
        );
    }

    /**
     * Создает refresh token с временем жизни 20 секунд
     * @param userId - ID пользователя
     * @param deviceId - ID устройства
     * @returns JWT токен в виде строки
     */
    async createRefreshToken(userId: string, deviceId: string): Promise<string> {
        return jwt.sign(
            { userId, deviceId },
            appConfig.AC_SECRET,   // можно вынести отдельный REFRESH_SECRET позже
            { expiresIn: '20s' }   // по требованиям тестов
        );
    }

    /**
     * Декодирует JWT токен без верификации подписи
     * Используется для получения информации из истекших токенов
     * @param token - JWT токен
     * @returns Payload токена или null если ошибка
     */
    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    }

    /**
     * Верифицирует JWT токен и проверяет его подпись
     * @param token - JWT токен
     * @returns Объект с userId и deviceId или null если невалиден
     */
    async verifyToken(token: string): Promise<{ userId: string; deviceId: string } | null> {
        try {
            // Верифицируем подпись токена
            const payload = jwt.verify(token, appConfig.AC_SECRET) as any;

            // Проверяем наличие обязательных полей
            if (!payload || !payload.userId || !payload.deviceId) {
                console.error("JWT payload missing userId or deviceId");
                return null;
            }

            // Возвращаем извлеченные данные
            return {
                userId: payload.userId,
                deviceId: payload.deviceId
            };
        } catch (error) {
            console.error("Token verify error:", error);
            return null;
        }
    }
}

/**
 * Singleton экземпляр JwtService
 * Используется во всем приложении через этот экземпляр
 */
export const jwtService = new JwtService();
