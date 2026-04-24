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
exports.createBlogPostHandler = createBlogPostHandler;
const Map_to_blogInput_dto_1 = require("../mappers/Map-to-blogInput-dto");
const Blogs_service_1 = require("../../application/Blogs.service");
const Map_to_blog_dto_1 = require("../mappers/Map-to-blog-dto");
const http_statuses_1 = require("../../../core/types/http-statuses");
const errors_handler_1 = require("../../../core/errors/errors.handler");
function createBlogPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blog = (0, Map_to_blogInput_dto_1.mapInputToBlog)(req.body);
            const createdBlogId = yield Blogs_service_1.BlogsService.create(blog);
            const createdBlog = yield Blogs_service_1.BlogsService.findByIdOrFail(createdBlogId);
            const blogDto = (0, Map_to_blog_dto_1.mapToBlogDto)(createdBlog);
            res.status(http_statuses_1.HttpStatus.Created).send(blogDto);
        }
        catch (e) {
            (0, errors_handler_1.errorsHandler)(e, res);
        }
    });
}
//# sourceMappingURL=create%20post-blog.handler.js.map