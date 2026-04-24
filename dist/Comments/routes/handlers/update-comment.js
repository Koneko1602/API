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
exports.updateCommentController = updateCommentController;
const Comments_service_1 = require("../../application/Comments.service");
const resultCode_1 = require("../../../Users/common/result/resultCode");
const http_statuses_1 = require("../../../core/types/http-statuses");
function updateCommentController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield Comments_service_1.CommentsService.updateComment(req.params.id, req.userId, req.body, req.headers.authorization);
            switch (result.status) {
                case resultCode_1.ResultStatus.Success:
                    return res.sendStatus(http_statuses_1.HttpStatus.NoContent); // 204
                case resultCode_1.ResultStatus.NotFound:
                    return res.sendStatus(http_statuses_1.HttpStatus.NotFound); // 404
                case resultCode_1.ResultStatus.Forbidden:
                    return res.sendStatus(http_statuses_1.HttpStatus.Forbidden); // 403
                case resultCode_1.ResultStatus.BadRequest:
                    // Здесь мы ожидаем, что BadRequest не произойдет, так как 400-валидация в роутере,
                    // но оставляем на случай других ошибок сервиса.
                    return res.status(http_statuses_1.HttpStatus.BadRequest).send({ errorsMessages: result.extensions });
                default:
                    return res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
            }
        }
        catch (e) {
            return res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
        }
    });
}
//# sourceMappingURL=update-comment.js.map