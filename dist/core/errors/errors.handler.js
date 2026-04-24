"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsHandler = errorsHandler;
const repository_not_found_error_1 = require("./repository-not-found.error");
const http_statuses_1 = require("../types/http-statuses");
const domain_error_1 = require("./domain.error");
const FieldError_1 = require("./FieldError");
function errorsHandler(error, res) {
    var _a;
    if (error instanceof repository_not_found_error_1.RepositoryNotFoundError) {
        const httpStatus = http_statuses_1.HttpStatus.NotFound;
        res.status(httpStatus).send((0, FieldError_1.createErrorsMessages)([
            {
                field: 'general',
                message: error.message,
            },
        ]));
        return;
    }
    if (error instanceof domain_error_1.DomainError) {
        const httpStatus = http_statuses_1.HttpStatus.BadRequest;
        const fieldErrors = [
            {
                field: (_a = error.source) !== null && _a !== void 0 ? _a : 'unknown',
                message: error.message,
            },
        ];
        res.status(httpStatus).send((0, FieldError_1.createErrorsMessages)(fieldErrors));
        return;
    }
    // 🟢 ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ: FALLBACK ДЛЯ ВСЕХ НЕОБРАБОТАННЫХ ОШИБОК
    console.error('Unhandled server error:', error);
    if (!res.headersSent) {
        res.status(http_statuses_1.HttpStatus.InternalServerError).send({
            errorsMessages: [{ field: "general", message: "Internal server error" }]
        });
    }
}
//# sourceMappingURL=errors.handler.js.map