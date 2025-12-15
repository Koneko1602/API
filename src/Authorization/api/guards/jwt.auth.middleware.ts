
import { NextFunction, Request, Response } from 'express';
import {jwtService} from "../../adapters/jwt.service";


export const jwtAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization; // 'Bearer xxxx'

    // 1. Проверка наличия заголовка и формата
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];

    // 2. ⚡️ Вызов СЕРВИСА (verifyToken)
    const userPayload = await jwtService.verifyToken(token); // Используем jwt.service.ts

    if (userPayload) {
        // 3. Если токен валиден, добавляем данные пользователя и продолжаем
        (req as any).userId = userPayload.userId;
        return next();
    } else {
        // 4. Если токен невалиден (истек, неверный ключ)
        return res.sendStatus(401);
    }
};