
import {getBlogListHandler} from "./handlers/get-blog-list.handler";
import {idValidation} from "../../core/Middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/Middlewares/validation/input-validation-result.middleware";
import {createBlogHandler} from "./handlers/create-blog.handler";
import {getBlogHandler} from "./handlers/get-blog.handler";
import {updateBlogHandler} from "./handlers/update-blog.handler";
import {deleteBlogHandler} from "./handlers/delete-blog.handler";
import {superAdminGuardMiddleware} from "../../Authorization/super-admin.guard-middleware";
import {Router} from "express";
import {BlogInputDtoValidation} from "../validation/blog.input-dto.validation-middlewares";
import {
    paginationAndSortingValidation
} from "../../core/Middlewares/validation/query-pagination-sorting.validation-middleware";
import {BlogSortField} from "./input/blog-sort-field";
import {getBlogPostListHandler} from "./handlers/get-blog-post-list.handler";


export const BlogRouter = Router ({});

BlogRouter
    .get(
        '',
        paginationAndSortingValidation(BlogSortField),
        inputValidationResultMiddleware,
        getBlogListHandler,
    )

    .get(
        '/:id',
        idValidation,
        inputValidationResultMiddleware,
        getBlogHandler,

    )

    .post(
        '',
        superAdminGuardMiddleware,
        BlogInputDtoValidation,
        inputValidationResultMiddleware,
        createBlogHandler,


    )

    .put(
        '/:id',
        superAdminGuardMiddleware,
        BlogInputDtoValidation,
        idValidation,
        inputValidationResultMiddleware,
        updateBlogHandler,

    )

    .delete('/:id',
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deleteBlogHandler,

    )
    .get(
        '/:id/posts',
        idValidation,
        paginationAndSortingValidation(BlogSortField),
        inputValidationResultMiddleware,
        getBlogPostListHandler,
    );