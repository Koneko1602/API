"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationAuthMiddleware = void 0;
const express_validator_1 = require("express-validator");
const http_statuses_1 = require("../../types/http-statuses");
const input_validation_result_middleware_1 = require("./input-validation-result.middleware");
const formaValidationError = (error) => {
    const expressError = error;
    return {
        status: http_statuses_1.HttpStatus.BadRequest,
        source: expressError.path,
        detail: expressError.msg,
    };
};
const inputValidationAuthMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req)
        .formatWith(formaValidationError)
        .array(); // ← убрали onlyFirstError: true, чтобы возвращать ВСЕ ошибки
    if (errors.length > 0) {
        console.log('[VALIDATION FAIL] Errors:', errors); // ← полезно для дебага
        res.status(http_statuses_1.HttpStatus.BadRequest).json((0, input_validation_result_middleware_1.createErrorMessages)(errors));
        return;
    }
    next();
};
exports.inputValidationAuthMiddleware = inputValidationAuthMiddleware;
//# sourceMappingURL=validation-auth.middleware.js.map