"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToBlogDataOutput = mapToBlogDataOutput;
const resource_type_1 = require("../../../core/types/resource-type");
function mapToBlogDataOutput(blog) {
    return {
        type: resource_type_1.ResourceType.Blogs,
        id: blog._id.toString(),
        attributes: {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        },
    };
}
//# sourceMappingURL=mapToBlogDataOutput.js.map