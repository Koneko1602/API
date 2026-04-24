"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogInputDtoValidation = void 0;
const express_validator_1 = require("express-validator");
const nameValidation = (0, express_validator_1.body)('name')
    .isString()
    .withMessage('name should be string')
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Length of name is not correct');
const description = (0, express_validator_1.body)('description')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Length of description is not correct');
const websiteUrl = (0, express_validator_1.body)('websiteUrl')
    .isString()
    .withMessage('URL should be string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Length of URL is not correct')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('URL must start with https:// and follow correct format');
exports.BlogInputDtoValidation = [
    nameValidation,
    description,
    websiteUrl,
];
//# sourceMappingURL=blog.input-dto.validation-middlewares.js.map