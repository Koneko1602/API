import { Request, Response} from "express";
import {postRepository} from "../../repository/PostRepository";
import {HttpStatus} from "../../../core/types/http-statuses";
import {MapToPostDto} from "../mappers/mapToPostDto";


export async function getPostListHandler(req: Request, res: Response) {
    try {
        const posts = await postRepository.findAll();
        const postDTOs =posts.map(MapToPostDto);
        res.status(HttpStatus.Ok).send(postDTOs);
    } catch (e:unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
