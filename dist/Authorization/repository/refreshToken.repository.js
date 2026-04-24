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
const jwt_service_1 = require("../adapters/jwt.service"); // ← подправь путь, если у тебя другая структура папок
exports.refreshTokenRepository = {
    create(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Генерируем JWT вместо randomUUID
            const refreshToken = yield jwt_service_1.jwtService.createRefreshToken(userId);
            const expiresAt = new Date(Date.now() + 20 * 1000); // 20 сек по Swagger
            yield Mongo_db_1.RefreshTokensCollection.insertOne({
                userId,
                token: refreshToken, // сохраняем полный JWT
                expiresAt,
                createdAt: new Date(),
            });
            return refreshToken; // ← возвращаем JWT в куку
        });
    },
    findValid(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Проверяем подпись и срок жизни JWT
            const verified = yield jwt_service_1.jwtService.verifyToken(token);
            if (!verified) {
                return null;
            }
            // 2. Проверяем, что токен не отозван в БД
            return Mongo_db_1.RefreshTokensCollection.findOne({
                token,
                expiresAt: { $gt: new Date() },
            });
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
};
//# sourceMappingURL=refreshToken.repository.js.map