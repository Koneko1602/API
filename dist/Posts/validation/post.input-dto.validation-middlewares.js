"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postForBlogInputDtoValidation = exports.postInputDtoValidation = void 0;
const express_validator_1 = require("express-validator");
const titleValidation = (0, express_validator_1.body)('title')
    .isString()
    .withMessage('title should be string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Length of name is not correct');
const shortDescription = (0, express_validator_1.body)('shortDescription')
    .isString()
    .withMessage('shortDescription should be string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Length of shortDescription is not correct');
const content = (0, express_validator_1.body)('content')
    .isString()
    .withMessage('content should be string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Length of content is not correct');
const blogId = (0, express_validator_1.body)('blogId')
    .isString()
    .withMessage('blogId should be string')
    .trim()
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('blogId must be a valid MongoDB ObjectId');
exports.postInputDtoValidation = [
    titleValidation,
    shortDescription,
    content,
    blogId,
];
exports.postForBlogInputDtoValidation = [
    titleValidation,
    shortDescription,
    content,
];
//# sourceMappingURL=post.input-dto.validation-middlewares.js.map