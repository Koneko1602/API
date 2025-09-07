import {Router} from "express";
import {getPostListHandler} from "./handlers/get-post-list.handler";
import {idValidation} from "../../core/Middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/Middlewares/validation/input-validation-result.middleware";
import {getPostHandler} from "./handlers/get-post.handler";
import {superAdminGuardMiddleware} from "../../Authorization/super-admin.guard-middleware";
import {createPostHandler} from "./handlers/create-post.handler";
import {updatePostHandler} from "./handlers/update-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";
import {PostInputDtoValidation} from "../validation/post.input-dto.validation-middlewares";


export const PostRouter = Router ({});

PostRouter
    .get('', getPostListHandler)

    .get(
        '/:id',
        idValidation,
        inputValidationResultMiddleware,
        getPostHandler,

    )

    .post(
        '',
        superAdminGuardMiddleware,
        PostInputDtoValidation,
        inputValidationResultMiddleware,
        createPostHandler,



    )

    .put(
        '/:id',
        superAdminGuardMiddleware,
        idValidation,
        PostInputDtoValidation,
        inputValidationResultMiddleware,
        updatePostHandler,

    )

    .delete('/:id',
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deletePostHandler,

    );