

import { ObjectId, WithId } from 'mongodb';
import { RefreshTokensCollection } from "../../db/Mongo.db";
import { jwtService } from '../adapters/jwt.service';
import {randomUUID} from "node:crypto";   // ← подправь путь, если у тебя другая структура папок

export interface RefreshTokenDB {
    _id?: ObjectId;
    userId: string;
    deviceId: string;           // ← обязательно
    title: string;              // название устройства (из user-agent)
    ip: string;                 // IP последнего входа
    lastActiveDate: Date;       // обновляется при каждом успешном refresh
    expiresAt: Date;
    createdAt: Date;
}

export const refreshTokenRepository = {
    // Создание новой сессии (при логине)
    async create(userId: string, ip: string, title: string): Promise<string> {
        const deviceId = randomUUID();

        const refreshToken = await jwtService.createRefreshToken(userId, deviceId);

        const expiresAt = new Date(Date.now() + 20 * 1000); // 20 сек по тестам

        await RefreshTokensCollection.insertOne({
            userId,
            deviceId,
            title,
            ip,
            lastActiveDate: new Date(),
            expiresAt,
            createdAt: new Date(),
        });

        return refreshToken;
    },

    async findValid(token: string): Promise<WithId<RefreshTokenDB> | null> {
        const verified = await jwtService.verifyToken(token);
        if (!verified || !verified.deviceId) return null;

        return RefreshTokensCollection.findOne({
            token,                    // если храните сам JWT (рекомендуется)
            // или по deviceId + userId, но проще хранить token
            expiresAt: { $gt: new Date() },
        });
    },
    async updateLastActive(token: string): Promise<void> {
        await RefreshTokensCollection.updateOne(
            { token },
            { $set: { lastActiveDate: new Date() } }
        );
    },

    async deleteByToken(token: string): Promise<void> {
        await RefreshTokensCollection.deleteOne({ token });
    },

    async deleteByUserId(userId: string): Promise<void> {
        await RefreshTokensCollection.deleteMany({ userId });
    },
    // Удалить все сессии пользователя кроме текущей (deviceId)
    async deleteAllOther(userId: string, currentDeviceId: string): Promise<void> {
        await RefreshTokensCollection.deleteMany({
            userId,
            deviceId: { $ne: currentDeviceId }
        });
    },
    // Удалить конкретную сессию
    async deleteByDeviceId(userId: string, deviceId: string): Promise<void> {
        await RefreshTokensCollection.deleteOne({ userId, deviceId });
    },
    // Получить все активные сессии пользователя
    async findAllByUserId(userId: string): Promise<WithId<RefreshTokenDB>[]> {
        return RefreshTokensCollection.find({ userId }).toArray();
    },
};