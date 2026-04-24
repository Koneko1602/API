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
exports.createPostForBlogHandler = createPostForBlogHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const Posts_service_1 = require("../../application/Posts.service");
const mapToPostDto_1 = require("../mappers/mapToPostDto");
const errors_handler_1 = require("../../../core/errors/errors.handler");
function createPostForBlogHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blogId = req.params.blogId;
            const createdPostId = yield Posts_service_1.PostsService.create({
                blogId,
                content: req.body.content,
                title: req.body.title,
                shortDescription: req.body.shortDescription
            });
            const createdPost = yield Posts_service_1.PostsService.findByIdOrFail(createdPostId);
            const postDto = (0, mapToPostDto_1.MapToPostDto)(createdPost);
            res.status(http_statuses_1.HttpStatus.Created).send(postDto);
        }
        catch (e) {
            (0, errors_handler_1.errorsHandler)(e, res);
        }
    });
}
//# sourceMappingURL=createPostForBlogHandler.js.map