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
exports.getCommentsForPostHandler = getCommentsForPostHandler;
const Comments_service_1 = require("../../../Comments/application/Comments.service");
const resultCode_1 = require("../../../Users/common/result/resultCode");
const http_statuses_1 = require("../../../core/types/http-statuses");
// Используем as any или Partial, так как req.query - это строки
function getCommentsForPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postId = req.params.id;
            // Просто передаем query как есть, приведение типов сделаем внутри
            const queryDto = req.query;
            const result = yield Comments_service_1.CommentsService.findCommentsForPost(postId, queryDto);
            switch (result.status) {
                case resultCode_1.ResultStatus.Success:
                    return res.status(http_statuses_1.HttpStatus.Ok).send(result.data);
                case resultCode_1.ResultStatus.NotFound:
                    return res.sendStatus(http_statuses_1.HttpStatus.NotFound);
                default:
                    return res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
            }
        }
        catch (e) {
            return res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
        }
    });
}
//# sourceMappingURL=get-comment-list.handler.js.map