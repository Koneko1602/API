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
exports.BlogsService = void 0;
const BlogRepository_1 = require("../repository/BlogRepository");
const Map_to_blog_update_1 = require("../routes/mappers/Map-to-blog-update");
exports.BlogsService = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return BlogRepository_1.blogRepository.findMany(queryDto);
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return BlogRepository_1.blogRepository.findByIdOrFail(id);
        });
    },
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                name: dto.name,
                description: dto.description,
                websiteUrl: dto.websiteUrl,
                createdAt: new Date(),
                isMembership: false,
            };
            return BlogRepository_1.blogRepository.create(newBlog);
        });
    },
    update(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield BlogRepository_1.blogRepository.findByIdOrFail(id);
            const dto = (0, Map_to_blog_update_1.mapInputToBlogDto)(id, input, existing);
            yield BlogRepository_1.blogRepository.update(id, dto);
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield BlogRepository_1.blogRepository.delete(id);
            return;
        });
    },
};
//# sourceMappingURL=Blogs.service.js.map