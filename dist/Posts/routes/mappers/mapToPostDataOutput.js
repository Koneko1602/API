"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPostDataOutput = mapToPostDataOutput;
const resource_type_1 = require("../../../core/types/resource-type");
function mapToPostDataOutput(post) {
    return {
        type: resource_type_1.ResourceType.Posts,
        id: post._id.toString(),
        attributes: {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt.toISOString(), // ← сразу сериализуем как строку
        },
    };
}
//# sourceMappingURL=mapToPostDataOutput.js.map