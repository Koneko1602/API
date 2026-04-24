"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
const get_comment_1 = require("./handlers/get-comment");
const params_id_validation_middleware_1 = require("../../core/Middlewares/validation/params-id.validation-middleware");
const input_validation_result_middleware_1 = require("../../core/Middlewares/validation/input-validation-result.middleware");
const update_comment_1 = require("./handlers/update-comment");
const validation_comment_1 = require("../validation/validation.comment");
const delete_comment_1 = require("./handlers/delete-comment");
const jwt_auth_middleware_1 = require("../../Authorization/api/guards/jwt.auth.middleware");
exports.commentRouter = (0, express_1.Router)({});
exports.commentRouter
    .get('/:id', params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, get_comment_1.getCommentByIdHandler)
    .put('/:id', jwt_auth_middleware_1.jwtAuthMiddleware, params_id_validation_middleware_1.idValidation, validation_comment_1.commentValidation.contentValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, update_comment_1.updateCommentController)
    .delete('/:id', jwt_auth_middleware_1.jwtAuthMiddleware, params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, delete_comment_1.deleteCommentController);
//# sourceMappingURL=comment.router.js.map