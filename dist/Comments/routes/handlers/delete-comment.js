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
exports.deleteCommentController = deleteCommentController;
const resultCode_1 = require("../../../Users/common/result/resultCode");
const Comments_service_1 = require("../../application/Comments.service");
function deleteCommentController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Вызов сервиса...
        const result = yield Comments_service_1.CommentsService.deleteComment(req.params.id, req.userId, req.headers.authorization);
        switch (result.status) {
            case resultCode_1.ResultStatus.Success:
                return res.sendStatus(204); // ✅ Соответствует примеру usersService (204)
            case resultCode_1.ResultStatus.NotFound:
                return res.sendStatus(404); // ✅ Соответствует примеру usersService (404)
            case resultCode_1.ResultStatus.Forbidden:
                return res.sendStatus(403); // 🛑 Дополнительная бизнес-проверка
            default:
                return res.sendStatus(500);
        }
    });
}
//# sourceMappingURL=delete-comment.js.map