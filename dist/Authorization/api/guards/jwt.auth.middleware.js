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
exports.jwtAuthMiddleware = void 0;
const jwt_service_1 = require("../../adapters/jwt.service");
const jwtAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }
    const token = authHeader.split(' ')[1];
    const payload = yield jwt_service_1.jwtService.verifyToken(token);
    if (!payload) {
        return res.sendStatus(401);
    }
    req.userId = payload.userId;
    req.deviceId = payload.deviceId; // ← добавлено
    next();
});
exports.jwtAuthMiddleware = jwtAuthMiddleware;
//# sourceMappingURL=jwt.auth.middleware.js.map