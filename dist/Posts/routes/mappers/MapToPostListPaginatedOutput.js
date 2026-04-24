"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPostListPaginatedOutput = mapToPostListPaginatedOutput;
function mapToPostListPaginatedOutput(posts, meta) {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: posts.map((post) => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        })),
    };
}
//# sourceMappingURL=MapToPostListPaginatedOutput.js.map