import { Router, Request, Response } from 'express';
import { refreshTokenRepository } from '../repository/refreshToken.repository';
import {refreshTokenMiddleware} from "../../API/Middlewares/refreshToken.middleware";

export const securityRouter = Router();

// GET /security/devices — список всех активных сессий текущего пользователя
securityRouter.get(
    '/devices',
    refreshTokenMiddleware,
    async (req: any, res: Response) => {
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
    refreshTokenMiddleware,
    async (req: any, res: Response) => {
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
    refreshTokenMiddleware,
    async (req:any, res: Response) => {
        try {
            const userId = req.userId;
            const { deviceId } = req.params;

            // ✅ Проверяем, существует ли сессия перед удалением
            const session =
                await refreshTokenRepository.findByDeviceId(deviceId);

            if (!session) {
                return res.sendStatus(404);
            }

            if (session.userId !== userId) {
                return res.sendStatus(403);
            }

            await refreshTokenRepository.deleteByDeviceId(
                userId,
                deviceId
            );

            return res.sendStatus(204);
        } catch (error) {
            console.error('❌ Security DELETE /devices/:deviceId error:', error);
            res.sendStatus(500);
        }
    }
);