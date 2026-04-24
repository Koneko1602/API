"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapToPostDto = void 0;
const MapToPostDto = (post) => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
});
exports.MapToPostDto = MapToPostDto;
//# sourceMappingURL=mapToPostDto.js.map