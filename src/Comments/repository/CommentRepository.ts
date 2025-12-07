import {CommentsCollection} from "../../db/Mongo.db";
import {ObjectId, WithId} from "mongodb";

import {ICommentDB} from "../types/comment.db.interface";


export const commentsRepository = {
    // Метод обновления
    async create(comment: ICommentDB): Promise<string> {
        const newComment = await CommentsCollection
            .insertOne({...comment});
        return newComment.insertedId.toString();
    },
    async update(id: string, content: string): Promise<boolean> {
        const result = await CommentsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {content: content}}
        );
        // Проверяем, что документ был найден и обновлен
        return result.matchedCount === 1;
    },
    async delete(id: string): Promise<boolean> {
        const isDel = await CommentsCollection
            .deleteOne({_id: new ObjectId(id)});
        return isDel.deletedCount === 1;
    },
    async findById(id: string): Promise<WithId<ICommentDB> | null> {
        return CommentsCollection
            .findOne({_id: new ObjectId(id)});
    }
}
