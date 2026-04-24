"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRouter = void 0;
const express_1 = require("express");
const all_data_1 = require("../handlers/all-data");
exports.TestRouter = (0, express_1.Router)({});
exports.TestRouter
    .delete('/all-data', all_data_1.deleteAllDataHandler);
//# sourceMappingURL=Test.router.js.map