"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenRepository = void 0;
const Mongo_db_1 = require("../../db/Mongo.db");
const jwt_service_1 = require("../adapters/jwt.service");
const node_crypto_1 = require("node:crypto");
exports.refreshTokenRepository = {
    // Создание новой сессии (при логине)
    create(userId, ip, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = (0, node_crypto_1.randomUUID)();
            const refreshToken = yield jwt_service_1.jwtService.createRefreshToken(userId, deviceId);
            const expiresAt = new Date(Date.now() + 20 * 1000); // 20 сек по тестам
            yield Mongo_db_1.RefreshTokensCollection.insertOne({
                userId,
                deviceId,
                title,
                ip,
                lastActiveDate: new Date(),
                expiresAt,
                createdAt: new Date(),
            });
            return refreshToken;
        });
    },
    findValid(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const verified = yield jwt_service_1.jwtService.verifyToken(token);
            if (!verified || !verified.deviceId)
                return null;
            return Mongo_db_1.RefreshTokensCollection.findOne({
                deviceId: verified.deviceId,
                userId: verified.userId,
                expiresAt: { $gt: new Date() },
            });
        });
    },
    updateLastActive(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Mongo_db_1.RefreshTokensCollection.updateOne({ token }, { $set: { lastActiveDate: new Date() } });
        });
    },
    deleteByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Mongo_db_1.RefreshTokensCollection.deleteOne({ token });
        });
    },
    deleteByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Mongo_db_1.RefreshTokensCollection.deleteMany({ userId });
        });
    },
    // Удалить все сессии пользователя кроме текущей (deviceId)
    deleteAllOther(userId, currentDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Mongo_db_1.RefreshTokensCollection.deleteMany({
                userId,
                deviceId: { $ne: currentDeviceId }
            });
        });
    },
    // Удалить конкретную сессию
    deleteByDeviceId(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Mongo_db_1.RefreshTokensCollection.deleteOne({ userId, deviceId });
        });
    },
    // Получить все активные сессии пользователя
    findAllByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Mongo_db_1.RefreshTokensCollection.find({ userId }).toArray();
        });
    },
};
//# sourceMappingURL=refreshToken.repository.js.map