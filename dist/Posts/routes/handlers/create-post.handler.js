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
exports.createPostHandler = createPostHandler;
const Posts_service_1 = require("../../application/Posts.service");
const http_statuses_1 = require("../../../core/types/http-statuses");
const errors_handler_1 = require("../../../core/errors/errors.handler");
const mapToPostDto_1 = require("../mappers/mapToPostDto");
const Map_to_postInput_dto_1 = require("../mappers/Map-to-postInput-dto");
const BlogRepository_1 = require("../../../Blogs/repository/BlogRepository");
function createPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Получаем blogId из тела запроса
            const blogId = req.body.blogId;
            // Ищем блог по blogId
            const blog = yield BlogRepository_1.blogRepository.findById(blogId);
            if (!blog) {
                res.status(http_statuses_1.HttpStatus.NotFound).send({ message: 'Блог не найден' });
                return;
            }
            // Получаем blogName из найденного блога
            const blogName = blog.name;
            // Собираем пост с blogName
            const post = (0, Map_to_postInput_dto_1.mapInputToPost)(req.body, blogName);
            const createdPostId = yield Posts_service_1.PostsService.create(post);
            const createdPost = yield Posts_service_1.PostsService.findByIdOrFail(createdPostId);
            const blogDto = (0, mapToPostDto_1.MapToPostDto)(createdPost);
            res.status(http_statuses_1.HttpStatus.Created).send(blogDto);
        }
        catch (e) {
            (0, errors_handler_1.errorsHandler)(e, res);
        }
    });
}
//# sourceMappingURL=create-post.handler.js.map