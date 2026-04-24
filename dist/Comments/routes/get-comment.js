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
exports.getCommentByIdController = getCommentByIdController;
const comments_service_1 = require("../services/comments.service");
const resultCode_1 = require("../types/resultCode"); // 💡 Файл resultCode.ts
const enums_1 = require("../common/enums"); // Предполагаемый enum для HTTP-статусов
function getCommentByIdController(req, // 💡 Строгий тип для req.params.id
res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const commentId = req.params.id;
            // 1. Вызываем Сервис
            const result = yield comments_service_1.CommentsService.findCommentById(commentId);
            // 2. Обработка ResultStatus
            switch (result.status) {
                case resultCode_1.ResultStatus.Success:
                    // 200 Success: возвращаем данные
                    return res.status(enums_1.HttpStatus.Ok).send(result.data);
                case resultCode_1.ResultStatus.NotFound:
                    // 404 Not Found: возвращаем пустой статус 404
                    return res.sendStatus(enums_1.HttpStatus.NotFound);
                // Здесь можно добавить обработку других ошибок,
                // но для GET /comments/:id нам нужны только Success и NotFound.
                default:
                    // Любая другая неожиданная ошибка
                    return res.sendStatus(enums_1.HttpStatus.InternalServerError); // 500
            }
        }
        catch (e) {
            // Ошибка уровня системы (например, ошибка подключения к БД)
            return res.sendStatus(enums_1.HttpStatus.InternalServerError);
        }
    });
}
//# sourceMappingURL=get-comment.js.map