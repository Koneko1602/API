"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = require("express");
const get_post_list_handler_1 = require("./handlers/get-post-list.handler");
const params_id_validation_middleware_1 = require("../../core/Middlewares/validation/params-id.validation-middleware");
const input_validation_result_middleware_1 = require("../../core/Middlewares/validation/input-validation-result.middleware");
const get_post_handler_1 = require("./handlers/get-post.handler");
const super_admin_guard_middleware_1 = require("../../Authorization/super-admin.guard-middleware");
const create_post_handler_1 = require("./handlers/create-post.handler");
const update_post_handler_1 = require("./handlers/update-post.handler");
const delete_post_handler_1 = require("./handlers/delete-post.handler");
const post_input_dto_validation_middlewares_1 = require("../validation/post.input-dto.validation-middlewares");
const get_comment_list_handler_1 = require("./handlers/get-comment-list.handler");
const create_comment_handler_1 = require("./handlers/create-comment.handler");
const validation_comment_1 = require("../../Comments/validation/validation.comment");
const jwt_auth_middleware_1 = require("../../Authorization/api/guards/jwt.auth.middleware");
exports.PostRouter = (0, express_1.Router)({});
exports.PostRouter
    .get('', get_post_list_handler_1.getPostListHandler)
    .get('/:id', params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, get_post_handler_1.getPostHandler)
    .get('/:id/comments', get_comment_list_handler_1.getCommentsForPostHandler)
    .post('', super_admin_guard_middleware_1.superAdminGuardMiddleware, post_input_dto_validation_middlewares_1.postInputDtoValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, create_post_handler_1.createPostHandler)
    .post('/:id/comments', jwt_auth_middleware_1.jwtAuthMiddleware, params_id_validation_middleware_1.idValidation, validation_comment_1.commentValidation.contentValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, create_comment_handler_1.createCommentForPostController)
    .put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, post_input_dto_validation_middlewares_1.postInputDtoValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, update_post_handler_1.updatePostHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, delete_post_handler_1.deletePostHandler);
//# sourceMappingURL=post.router.rs.js.map