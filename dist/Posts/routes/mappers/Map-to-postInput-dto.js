"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapInputToPost = void 0;
const mapInputToPost = (input, blogName) => ({
    title: input.title,
    shortDescription: input.shortDescription,
    content: input.content,
    createdAt: new Date(),
    blogId: input.blogId,
    blogName, // ✅ теперь TypeScript доволен
});
exports.mapInputToPost = mapInputToPost;
// export const mapInputToPost = (
//     input: PostInputModel,
//     blogName: string,
//     blogId: string
// ): Post => ({
//     title: input.title,
//     shortDescription: input.shortDescription,
//     content: input.content,
//     createdAt: new Date(),
//     blogId,
//     blogName,
// });
// тестовый для ошибки 1
//# sourceMappingURL=Map-to-postInput-dto.js.map