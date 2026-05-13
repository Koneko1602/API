import { Router, Response, Request } from 'express';
import { refreshTokenRepository } from '../repository/refreshToken.repository';
import { AuthenticatedRequest, jwtAuthMiddleware } from "../api/guards/jwt.auth.middleware";

export const securityRouter = Router();

// GET /security/devices — список всех активных сессий текущего пользователя
securityRouter.get(
    '/devices',
    jwtAuthMiddleware,
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.userId;

            const sessions = await refreshTokenRepository.findAllByUserId(userId);

            const viewModel = sessions.map(s => ({
                ip: s.ip,
                title: s.title,
                lastActiveDate: s.lastActiveDate.toISOString(),
                deviceId: s.deviceId,
            }));

            res.status(200).json(viewModel);
        } catch (error) {
            console.error('❌ Security GET /devices error:', error);
            res.sendStatus(500);
        }
    }
);

// DELETE /security/devices — удалить все сессии кроме текущей
securityRouter.delete(
    '/devices',
    jwtAuthMiddleware,
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.userId;
            const currentDeviceId = req.deviceId;

            // ✅ Проверяем deviceId после JWT верификации
            if (!currentDeviceId) {
                console.error('❌ Security: deviceId missing after JWT verification');
                return res.sendStatus(500);
            }

            await refreshTokenRepository.deleteAllOther(userId, currentDeviceId);
            res.sendStatus(204);
        } catch (error) {
            console.error('❌ Security DELETE /devices error:', error);
            res.sendStatus(500);
        }
    }
);

// DELETE /security/devices/:deviceId — удалить конкретную сессию
securityRouter.delete(
    '/devices/:deviceId',
    jwtAuthMiddleware,
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.userId;
            const { deviceId } = req.params;

            // ✅ Проверяем, существует ли сессия перед удалением
            const token = await refreshTokenRepository.findByDeviceIdAndUserId(userId, deviceId);

            if (!token) {
                return res.sendStatus(404);  // Not Found
            }

            // ✅ Удаляем только если найдена
            await refreshTokenRepository.deleteByDeviceId(userId, deviceId);
            res.sendStatus(204);
        } catch (error) {
            console.error('❌ Security DELETE /devices/:deviceId error:', error);
            res.sendStatus(500);
        }
    }
);
