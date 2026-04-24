"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortQueryFieldsUtil = void 0;
const sortQueryFieldsUtil = (query) => {
    const pageNumber = !isNaN(Number(query.pageNumber))
        ? Number(query.pageNumber)
        : 1;
    const pageSize = !isNaN(Number(query.pageSize))
        ? Number(query.pageSize)
        : 10;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortDirection = query.sortDirection === "asc" ? 1 : -1;
    const result = {
        pageNumber,
        pageSize,
        sortDirection,
        sortBy,
    };
    return result;
};
exports.sortQueryFieldsUtil = sortQueryFieldsUtil;
//# sourceMappingURL=sortQueryFields.util.js.map