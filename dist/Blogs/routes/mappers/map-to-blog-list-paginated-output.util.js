"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToBlogListPaginatedOutput = mapToBlogListPaginatedOutput;
const mapToPostDataOutput_1 = require("../../../Posts/routes/mappers/mapToPostDataOutput");
// ИСПРАВЛЕННАЯ ФУНКЦИЯ ДЛЯ ПРОХОЖДЕНИЯ ТЕСТА
function mapToBlogListPaginatedOutput(posts, meta) {
    return {
        meta: {
            page: meta.pageNumber,
            pageSize: meta.pageSize,
            pageCount: Math.ceil(meta.totalCount / meta.pageSize),
            totalCount: meta.totalCount,
        },
        data: posts.map(mapToPostDataOutput_1.mapToPostDataOutput),
    };
}
//# sourceMappingURL=map-to-blog-list-paginated-output.util.js.map