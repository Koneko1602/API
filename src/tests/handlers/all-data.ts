
import { Request, Response} from "express";
import {BlogsCollection, PostsCollection, UsersCollection} from "../../db/Mongo.db";

export async function deleteAllDataHandler(req: Request, res: Response) {


    await BlogsCollection.deleteMany({});
    await PostsCollection.deleteMany({});
    await  UsersCollection.deleteMany({});
    res.sendStatus(204);
}