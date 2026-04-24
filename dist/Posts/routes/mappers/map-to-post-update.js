"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapInputToPostDto = mapInputToPostDto;
function mapInputToPostDto(id, input, existing) {
    return {
        id,
        title: input.title,
        shortDescription: input.shortDescription,
        content: input.content,
        blogId: input.blogId,
        blogName: existing.blogName,
        createdAt: existing.createdAt,
    };
}
//# sourceMappingURL=map-to-post-update.js.map