"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapInputToBlogDto = mapInputToBlogDto;
function mapInputToBlogDto(id, input, existing) {
    return {
        id,
        name: input.name,
        description: input.description,
        websiteUrl: input.websiteUrl,
        createdAt: existing.createdAt,
        isMembership: existing.isMembership,
    };
}
//# sourceMappingURL=Map-to-blog-update.js.map