"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortDirectionValidation = exports.sortByValidation = exports.pageSizeValidation = exports.pageNumberValidation = void 0;
const express_validator_1 = require("express-validator");
exports.pageNumberValidation = (0, express_validator_1.query)("pageNumber").toInt().default(1);
exports.pageSizeValidation = (0, express_validator_1.query)("pageSize").toInt().default(10);
exports.sortByValidation = (0, express_validator_1.query)("sortBy").default("createdAt");
exports.sortDirectionValidation = (0, express_validator_1.query)("sortDirection").default("desc");
const s = 10;
//# sourceMappingURL=sorting.pagination.validation.js.map