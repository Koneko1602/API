

import { ObjectId, WithId } from 'mongodb';
import { randomUUID } from 'crypto';
import {RefreshTokensCollection} from "../../db/Mongo.db";

export interface RefreshTokenDB {
    _id?: ObjectId;
    userId: string;
    token: string;         // random string
    expiresAt: Date;
    createdAt: Date;
}

export const refreshTokenRepository = {
    async create(userId: string): Promise<string> {
        const token = randomUUID();
        const expiresAt = new Date(Date.now() + 20 * 1000); // 20 сек по Swagger

        await RefreshTokensCollection.insertOne({
            userId,
            token,
            expiresAt,
            createdAt: new Date(),
        });

        return token;
    },

    async findValid(token: string): Promise<WithId<RefreshTokenDB> | null> {
        return RefreshTokensCollection.findOne({
            token,
            expiresAt: { $gt: new Date() },
        });
    },

    async deleteByToken(token: string): Promise<void> {
        await RefreshTokensCollection.deleteOne({ token });
    },

    async deleteByUserId(userId: string): Promise<void> {
        await RefreshTokensCollection.deleteMany({ userId }); // на всякий случай (multi-device)
    },
};