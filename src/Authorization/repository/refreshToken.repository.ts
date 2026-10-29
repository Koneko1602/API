
import { ObjectId, WithId } from 'mongodb';
import { RefreshTokensCollection } from "../../db/Mongo.db";
import { jwtService } from '../adapters/jwt.service';
import {randomUUID} from "node:crypto";


export interface RefreshTokenDB {
    _id?: ObjectId;
    userId: string;
    deviceId: string;
    title: string;
    ip: string;
    lastActiveDate: Date;
    expiresAt: Date;
    createdAt: Date;
    token: string;
}

export const refreshTokenRepository = {
    async create(userId: string,deviceId:string, ip: string, title: string): Promise<string> {
        const refreshToken = await jwtService.createRefreshToken(userId, deviceId);
        const expiresAt = new Date(Date.now() + 20 * 1000);

        await RefreshTokensCollection.insertOne({
            userId,
            deviceId,
            title,
            ip,
            lastActiveDate: new Date(),
            expiresAt,
            createdAt: new Date(),
            token:refreshToken,

        });

        return refreshToken;
    },

    async findValid(token: string): Promise<WithId<RefreshTokenDB> | null> {
        const verified = await jwtService.verifyToken(token);
        if (!verified?.deviceId || !verified?.userId) return null;

        return RefreshTokensCollection.findOne({
            token,
            deviceId: verified.deviceId,
            userId: verified.userId,
            expiresAt: { $gt: new Date() },
        });
    },

    async deleteByToken(token: string): Promise<void> {
        const verified = await jwtService.verifyToken(token);
        //  Проверяем оба параметра!
        if (!verified?.deviceId || !verified?.userId) return;

        await RefreshTokensCollection.deleteOne({
           token,
        });
    },
    async findByDeviceId(deviceId: string) {
        return RefreshTokensCollection.findOne({ deviceId });
    },
    async deleteByUserId(userId: string): Promise<void> {
        await RefreshTokensCollection.deleteMany({ userId });
    },

    async deleteAllOther(userId: string, currentDeviceId: string): Promise<void> {
        await RefreshTokensCollection.deleteMany({
            userId,
            deviceId: { $ne: currentDeviceId }
        });
    },

    async deleteByDeviceId(userId: string, deviceId: string): Promise<void> {
        await RefreshTokensCollection.deleteOne({ userId, deviceId });
    },

    async findAllByUserId(userId: string): Promise<WithId<RefreshTokenDB>[]> {
        return RefreshTokensCollection.find({ userId }).toArray();
    },

    //  НОВЫЙ МЕТОД для безопасной проверки существования
    async findByDeviceIdAndUserId(
        userId: string,
        deviceId: string
    ): Promise<WithId<RefreshTokenDB> | null> {
        return RefreshTokensCollection.findOne({ userId, deviceId });
    },

    async updateLastActive(token: string): Promise<void> {
        const verified = await jwtService.verifyToken(token);
        //   Проверяем оба параметра!
        if (!verified?.deviceId || !verified?.userId) return;

        await RefreshTokensCollection.updateOne(
            { deviceId: verified.deviceId, userId: verified.userId },
            { $set: { lastActiveDate: new Date() } }
        );
    },
};