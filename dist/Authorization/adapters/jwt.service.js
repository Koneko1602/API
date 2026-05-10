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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../core/settings/config");
exports.jwtService = {
    createToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId }, config_1.appConfig.AC_SECRET, {
                expiresIn: '10s', // по Swagger тестовый режим
            });
        });
    },
    createRefreshToken(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId, deviceId }, config_1.appConfig.AC_SECRET, // можно вынести отдельный REFRESH_SECRET позже
            { expiresIn: '20s' } // по требованиям тестов
            );
        });
    },
    decodeToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return jsonwebtoken_1.default.decode(token);
            }
            catch (e) {
                console.error("Can't decode token", e);
                return null;
            }
        });
    },
    // async verifyToken(token: string): Promise<{ userId: string } | null> {
    //     try {
    //         return jwt.verify(token, appConfig.AC_SECRET) as { userId: string };
    //     } catch (error) {
    //         console.error("Token verify some error");
    //         return null;
    //     }
    // },
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return jsonwebtoken_1.default.verify(token, config_1.appConfig.AC_SECRET);
            }
            catch (error) {
                console.error("Token verify error");
                return null;
            }
        });
    },
};
//. Это типичный сервис для реализации аутентификации и авторизации в приложении.
//# sourceMappingURL=jwt.service.js.map