import {Router} from "express";
import {getCommentByIdHandler} from "./handlers/get-comment";
import {idValidation} from "../../core/Middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/Middlewares/validation/input-validation-result.middleware";
import {updateCommentController} from "./handlers/update-comment";
import {commentValidation} from "../validation/validation.comment";
import {deleteCommentController} from "./handlers/delete-comment";
import {jwtAuthMiddleware} from "../../Authorization/api/guards/jwt.auth.middleware";

export const commentRouter = Router({});


commentRouter

    .get('/:id',
        idValidation,
        inputValidationResultMiddleware,
        getCommentByIdHandler)

    .put('/:id',
        jwtAuthMiddleware,
        idValidation,
        commentValidation.contentValidation,
        inputValidationResultMiddleware,
        updateCommentController,
        )

    .delete('/:id',
        jwtAuthMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deleteCommentController,)
