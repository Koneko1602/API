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
exports.authRouter = void 0;
const express_1 = require("express");
const http_statuses_1 = require("../../core/types/http-statuses");
const validation_user_1 = require("../../Users/validation/validation.user");
const input_validation_result_middleware_1 = require("../../core/Middlewares/validation/input-validation-result.middleware");
const auth_service_1 = require("../domain/auth.service");
const resultCode_1 = require("../../Users/common/result/resultCode");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/login', validation_user_1.userValidation.passwordValidation, validation_user_1.userValidation.loginOrEmailValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginOrEmail, password } = req.body;
    // 1. Получаем Result объект
    const result = yield auth_service_1.authService.loginUser(loginOrEmail, password);
    // 2. Проверяем статус: если ошибка аутентификации
    if (result.status === resultCode_1.ResultStatus.Unauthorized) {
        // Отправляем ожидаемый 401 статус
        return res.status(http_statuses_1.HttpStatus.Unauthorized).end();
        // Если тесты требуют тело ответа, используйте:
        // return res.status(HttpStatus.Unauthorized).json(createErrorMessages(result.extensions));
    }
    // 3. Если статус "Успех"
    if (result.status === resultCode_1.ResultStatus.Success) {
        // Отправляем 200 OK и токен
        return res.status(http_statuses_1.HttpStatus.Ok).send({ accessToken: result.data.accessToken });
    }
    // На всякий случай обрабатываем неожиданный статус
    return res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
}));
//# sourceMappingURL=auth.router.js.map