"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToBlogDto = void 0;
const mapToBlogDto = (blog) => ({
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
});
exports.mapToBlogDto = mapToBlogDto;
//# sourceMappingURL=Map-to-blog-dto.js.map