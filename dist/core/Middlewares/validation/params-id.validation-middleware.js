"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogIdValidation = exports.idValidation = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
exports.idValidation = (0, express_validator_1.param)('id')
    .exists().withMessage('ID is required')
    .isString().withMessage('ID must be a string')
    .isLength({ min: 1 }).withMessage('ID must not be empty');
exports.blogIdValidation = (0, express_validator_1.param)('blogId')
    .exists().withMessage('Blog ID is required')
    .isString().withMessage('Blog ID must be a string')
    .isLength({ min: 1 }).withMessage('Blog ID must not be empty')
    .custom((value) => {
    // Проверяем, может ли строка быть преобразована в валидный ObjectId
    if (!mongodb_1.ObjectId.isValid(value)) {
        // Если формат неверный, выбрасываем ошибку, которая приведет к 400 Bad Request
        throw new Error('Blog ID must be a valid MongoDB ObjectId');
    }
    return true;
});
//# sourceMappingURL=params-id.validation-middleware.js.map