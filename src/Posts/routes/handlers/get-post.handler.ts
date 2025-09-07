import { Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {postRepository} from "../../repository/PostRepository";
import {createErrorsMessages} from "../../../core/errors/FieldError";
import {MapToPostDto} from "../mappers/mapToPostDto";

export async function getPostHandler (req: Request, res: Response) {
    try{
        const id = req.params.id;
        const post = await postRepository.findById(id);
        if (!post) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorsMessages([{field: 'id', message: 'Post not found'}]),
                );
            return;
        }

        res.status(HttpStatus.Ok).send(MapToPostDto(post));
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
