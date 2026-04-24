"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultCodeToHttpException = void 0;
const resultCode_1 = require("./resultCode");
const http_statuses_1 = require("../../../core/types/http-statuses");
const resultCodeToHttpException = (resultCode) => {
    switch (resultCode) {
        case resultCode_1.ResultStatus.BadRequest:
            return http_statuses_1.HttpStatus.BadRequest;
        case resultCode_1.ResultStatus.Forbidden:
            return http_statuses_1.HttpStatus.Forbidden;
        default:
            return http_statuses_1.HttpStatus.InternalServerError;
    }
};
exports.resultCodeToHttpException = resultCodeToHttpException;
//# sourceMappingURL=resultCodeToHttpException.js.map