"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapInputToBlog = void 0;
const mapInputToBlog = (input) => ({
    name: input.name,
    description: input.description,
    websiteUrl: input.websiteUrl,
    createdAt: new Date(),
    isMembership: false,
});
exports.mapInputToBlog = mapInputToBlog;
//# sourceMappingURL=Map-to-blogInput-dto.js.map