import { Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {postRepository} from "../../repository/PostRepository";
import {createErrorsMessages} from "../../../core/errors/FieldError";
import {PostsService} from "../../application/Posts.service";

export async function deletePostHandler(req: Request, res: Response) {

    try {

        const id = req.params.id;
        const post = await postRepository.findById(id);

        if (!post) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorsMessages([{field: 'id', message: ' Post not found'}]),
                );
            return;
        }
        await PostsService.delete(id);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError)
    }
}








