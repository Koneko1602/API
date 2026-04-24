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
exports.PostsService = void 0;
const PostRepository_1 = require("../repository/PostRepository");
const map_to_post_update_1 = require("../routes/mappers/map-to-post-update");
const BlogRepository_1 = require("../../Blogs/repository/BlogRepository");
exports.PostsService = {
    findPostByBlog(queryDto, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield BlogRepository_1.blogRepository.findByIdOrFail(blogId);
            return PostRepository_1.postRepository.findPostByBlog(queryDto, blogId);
        });
    },
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return PostRepository_1.postRepository.findMany(queryDto);
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return PostRepository_1.postRepository.findByIdOrFail(id);
        });
    },
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield BlogRepository_1.blogRepository.findByIdOrFail(dto.blogId);
            const newPost = {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogName: blog.name,
                blogId: dto.blogId,
                createdAt: new Date(),
            };
            return PostRepository_1.postRepository.create(newPost);
        });
    },
    update(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield PostRepository_1.postRepository.findByIdOrFail(id);
            const dto = (0, map_to_post_update_1.mapInputToPostDto)(id, input, existing);
            yield PostRepository_1.postRepository.update(id, dto);
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield PostRepository_1.postRepository.delete(id);
            return;
        });
    },
};
//# sourceMappingURL=Posts.service.js.map