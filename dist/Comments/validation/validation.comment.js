"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidation = void 0;
const express_validator_1 = require("express-validator");
const contentValidation = (0, express_validator_1.body)("content")
    .isString()
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage("Content must be 20-300 characters long");
exports.commentValidation = {
    contentValidation
};
//# sourceMappingURL=validation.comment.js.map