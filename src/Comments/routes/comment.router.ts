import {Router} from "express";
import {getCommentByIdHandler} from "./handlers/get-comment";

export const commentRouter = Router({});



commentRouter

    .get('/:id', getCommentByIdHandler)
    .put('/:id',)
