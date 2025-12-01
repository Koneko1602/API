import {CommentViewModel} from "../domain/CommentsModel";
import {CommentsCollection} from "../../db/Mongo.db";
import {ObjectId, WithId} from "mongodb";


export const commentsRepository = {
    // Метод обновления
    async update(id: string, content: string): Promise<boolean> {
        const result = await CommentsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { content: content } }
        );
        // Проверяем, что документ был найден и обновлен
        return result.matchedCount === 1;
    },
    async delete(id: string): Promise<boolean> {
        const isDel = await CommentsCollection
            .deleteOne({_id: new ObjectId(id)});
        return isDel.deletedCount === 1;
    },
    async findById(id: string): Promise<WithId<CommentViewModel> | null> {
        return CommentsCollection
            .findOne({_id: new ObjectId(id)});
    }
}
