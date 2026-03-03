

import { ObjectId, WithId } from 'mongodb';
import { RefreshTokensCollection } from "../../db/Mongo.db";
import { jwtService } from '../adapters/jwt.service';   // ← подправь путь, если у тебя другая структура папок

export interface RefreshTokenDB {
    _id?: ObjectId;
    userId: string;
    token: string;          // теперь это JWT (строка с точками)
    expiresAt: Date;
    createdAt: Date;
}

export const refreshTokenRepository = {
    async create(userId: string): Promise<string> {
        // Генерируем JWT вместо randomUUID
        const refreshToken = await jwtService.createRefreshToken(userId);

        const expiresAt = new Date(Date.now() + 20 * 1000); // 20 сек по Swagger

        await RefreshTokensCollection.insertOne({
            userId,
            token: refreshToken,        // сохраняем полный JWT
            expiresAt,
            createdAt: new Date(),
        });

        return refreshToken;            // ← возвращаем JWT в куку
    },

    async findValid(token: string): Promise<WithId<RefreshTokenDB> | null> {
        // 1. Проверяем подпись и срок жизни JWT
        const verified = await jwtService.verifyToken(token);
        if (!verified) {
            return null;
        }

        // 2. Проверяем, что токен не отозван в БД
        return RefreshTokensCollection.findOne({
            token,
            expiresAt: { $gt: new Date() },
        });
    },

    async deleteByToken(token: string): Promise<void> {
        await RefreshTokensCollection.deleteOne({ token });
    },

    async deleteByUserId(userId: string): Promise<void> {
        await RefreshTokensCollection.deleteMany({ userId });
    },
};