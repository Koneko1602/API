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
exports.getPostHandler = getPostHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const PostRepository_1 = require("../../repository/PostRepository");
const FieldError_1 = require("../../../core/errors/FieldError");
const mapToPostDto_1 = require("../mappers/mapToPostDto");
function getPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const post = yield PostRepository_1.postRepository.findById(id);
            if (!post) {
                res
                    .status(http_statuses_1.HttpStatus.NotFound)
                    .send((0, FieldError_1.createErrorsMessages)([{ field: 'id', message: 'Post not found' }]));
                return;
            }
            res.status(http_statuses_1.HttpStatus.Ok).send((0, mapToPostDto_1.MapToPostDto)(post));
        }
        catch (e) {
            res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
        }
    });
}
//# sourceMappingURL=get-post.handler.js.map