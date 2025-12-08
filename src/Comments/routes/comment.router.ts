import {Router} from "express";
import {getCommentByIdHandler} from "./handlers/get-comment";
import {idValidation} from "../../core/Middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/Middlewares/validation/input-validation-result.middleware";
import {updateCommentController} from "./handlers/update-comment";
import {baseAuthGuard} from "../../Authorization/api/guards/base.auth.guard";
import {commentValidation} from "../validation/validation.comment";
import {deleteCommentController} from "./handlers/delete-comment";

export const commentRouter = Router({});


commentRouter

    .get('/:id',
        idValidation,
        inputValidationResultMiddleware,
        getCommentByIdHandler)

    .put('/:id',
        baseAuthGuard,
        idValidation,
        inputValidationResultMiddleware,
        commentValidation.contentValidation,
        updateCommentController,
        )

    .delete('/:id',
        baseAuthGuard,
        idValidation,
        inputValidationResultMiddleware,
        deleteCommentController,)
