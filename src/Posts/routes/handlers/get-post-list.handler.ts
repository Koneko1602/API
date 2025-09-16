import { Request, Response} from "express";
import {postRepository} from "../../repository/PostRepository";
import {HttpStatus} from "../../../core/types/http-statuses";
import {MapToPostDto} from "../mappers/mapToPostDto";
import {PostsService} from "../../application/Posts.service";
import {PostQueryInput} from "../input/post-query.input";
import {PostInputModel} from "../../domain/PostModel";


export async function getPostListHandler(
    req: Request <PostQueryInput, {},PostQueryInput>,
    res: Response,
) {
    try {


        const posts = await PostsService.findMany(req.body);

        res.status(HttpStatus.Ok).send();
    } catch (e:unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
