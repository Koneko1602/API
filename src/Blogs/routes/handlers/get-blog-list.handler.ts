import { Request, Response} from "express";
import {blogRepository} from "../../repository/BlogRepository";
import {HttpStatus} from "../../../core/types/http-statuses";
import { mapToBlogDto } from '../mappers/Map-to-blog-dto';
import {Blog} from "../../domain/BlogModel";
import {WithId} from "mongodb";

export async function getBlogListHandler(
    req: Request<{ id: string }>,
    res: Response,
){
        try {



    }
