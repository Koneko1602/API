"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationResultMiddleware = exports.createErrorMessages = void 0;
const express_validator_1 = require("express-validator");
const http_statuses_1 = require("../../types/http-statuses");
// Обновленная функция для соответствия тесту
const createErrorMessages = (errors) => {
    return {
        errorsMessages: errors.map((error) => {
            var _a;
            return ({
                // source (путь/имя поля) -> field
                field: (_a = error.source) !== null && _a !== void 0 ? _a : 'general',
                // detail (сообщение) -> message
                message: error.detail,
            });
        }),
    };
};
exports.createErrorMessages = createErrorMessages;
const formaValidationError = (error) => {
    const expressError = error;
    return {
        status: http_statuses_1.HttpStatus.BadRequest,
        source: expressError.path,
        detail: expressError.msg,
    };
};
const inputValidationResultMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req)
        .formatWith(formaValidationError)
        .array({ onlyFirstError: true });
    if (errors.length > 0) {
        console.log('[VALIDATION FAIL] Errors:', errors); // ← лог ошибок
        res.status(http_statuses_1.HttpStatus.BadRequest).json((0, exports.createErrorMessages)(errors));
        return;
    }
    next();
};
exports.inputValidationResultMiddleware = inputValidationResultMiddleware;
//# sourceMappingURL=input-validation-result.middleware.js.map