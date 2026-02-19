// repository/refreshToken.repository.ts

import { model, Schema } from 'mongoose';

const refreshSchema = new Schema({
    userId: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, expires: 0 }, // TTL
});

export const RefreshTokenModel = model('RefreshToken', refreshSchema);

export const refreshTokenRepository = {
    async create(data: { userId: string; token: string; expiresAt: Date }) {
        await RefreshTokenModel.create(data);
    },

    async findValidByToken(token: string) {
        return RefreshTokenModel.findOne({ token, expiresAt: { $gt: new Date() } });
    },

    async deleteByToken(token: string) {
        await RefreshTokenModel.deleteOne({ token });
    },

    async deleteById(id: string) {
        await RefreshTokenModel.findByIdAndDelete(id);
    },
};