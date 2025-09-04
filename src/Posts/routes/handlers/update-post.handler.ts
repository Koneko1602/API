import { Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {postRepository} from "../../repository/PostRepository";
import {createErrorsMessages} from "../../../core/errors/FieldError";
import {PostInputModel} from "../../domain/PostModel";


export async function updatePostHandler (
    req: Request <{id: string}, {}, PostInputModel>,
    res: Response,
){
    try {

        const id: string = req.params.id;
        const post =  await postRepository.findById(id);


        if (!post) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorsMessages([{field: 'id', message: 'Post not found '}]),
                );
            return;
        }
        await postRepository.update(id, req.body)
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
