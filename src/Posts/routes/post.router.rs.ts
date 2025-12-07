import {Router} from "express";
import {getPostListHandler} from "./handlers/get-post-list.handler";
import {idValidation} from "../../core/Middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/Middlewares/validation/input-validation-result.middleware";
import {getPostHandler} from "./handlers/get-post.handler";
import {superAdminGuardMiddleware} from "../../Authorization/super-admin.guard-middleware";
import {createPostHandler} from "./handlers/create-post.handler";
import {updatePostHandler} from "./handlers/update-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";
import {postInputDtoValidation} from "../validation/post.input-dto.validation-middlewares";
import {getCommentsForPostHandler} from "./handlers/get-comment-list.handler";



export const PostRouter = Router ({});

PostRouter
    .get('', getPostListHandler)

    .get(
        '/:id',
        idValidation,
        inputValidationResultMiddleware,
        getPostHandler,

    )
    .get('/:id/comments', getCommentsForPostHandler)

    .post(
        '',
        superAdminGuardMiddleware,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        createPostHandler,



     )

    .put(
        '/:id',
        superAdminGuardMiddleware,
        idValidation,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        updatePostHandler,

    )

    .delete('/:id',
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deletePostHandler,

    );