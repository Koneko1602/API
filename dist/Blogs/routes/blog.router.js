"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRouter = void 0;
const get_blog_list_handler_1 = require("./handlers/get-blog-list.handler");
const params_id_validation_middleware_1 = require("../../core/Middlewares/validation/params-id.validation-middleware");
const input_validation_result_middleware_1 = require("../../core/Middlewares/validation/input-validation-result.middleware");
const create_blog_handler_1 = require("./handlers/create-blog.handler");
const get_blog_handler_1 = require("./handlers/get-blog.handler");
const update_blog_handler_1 = require("./handlers/update-blog.handler");
const delete_blog_handler_1 = require("./handlers/delete-blog.handler");
const super_admin_guard_middleware_1 = require("../../Authorization/super-admin.guard-middleware");
const express_1 = require("express");
const blog_input_dto_validation_middlewares_1 = require("../validation/blog.input-dto.validation-middlewares");
const query_pagination_sorting_validation_middleware_1 = require("../../core/Middlewares/validation/query-pagination-sorting.validation-middleware");
const blog_sort_field_1 = require("./input/blog-sort-field");
const get_blog_post_list_handler_1 = require("./handlers/get-blog-post-list.handler");
const create_post_blog_handler_1 = require("./handlers/create post-blog.handler");
const post_input_dto_validation_middlewares_1 = require("../../Posts/validation/post.input-dto.validation-middlewares");
const createPostForBlogHandler_1 = require("../../Posts/routes/handlers/createPostForBlogHandler");
const post_sort_field_1 = require("../../Posts/routes/input/post-sort-field");
exports.BlogRouter = (0, express_1.Router)({});
exports.BlogRouter
    .get('', (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(blog_sort_field_1.BlogSortField), input_validation_result_middleware_1.inputValidationResultMiddleware, get_blog_list_handler_1.getBlogListHandler)
    .get('/:id', params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, get_blog_handler_1.getBlogHandler)
    .post('', super_admin_guard_middleware_1.superAdminGuardMiddleware, blog_input_dto_validation_middlewares_1.BlogInputDtoValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, create_blog_handler_1.createBlogHandler, create_post_blog_handler_1.createBlogPostHandler)
    .put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, blog_input_dto_validation_middlewares_1.BlogInputDtoValidation, params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, update_blog_handler_1.updateBlogHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, delete_blog_handler_1.deleteBlogHandler)
    .post('/:blogId/posts', super_admin_guard_middleware_1.superAdminGuardMiddleware, post_input_dto_validation_middlewares_1.postForBlogInputDtoValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, createPostForBlogHandler_1.createPostForBlogHandler)
    .get('/:blogId/posts', params_id_validation_middleware_1.blogIdValidation, (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(post_sort_field_1.PostSortField), input_validation_result_middleware_1.inputValidationResultMiddleware, get_blog_post_list_handler_1.getBlogPostListHandler);
//# sourceMappingURL=blog.router.js.map