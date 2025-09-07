
import {ObjectId, WithId} from "mongodb";
import {PostsCollection} from "../../db/Mongo.db";
import {Post, PostInputModel} from "../domain/PostModel";




export const postRepository = {
    async findAll():  Promise<WithId<Post>[]>{
        return PostsCollection.find().toArray();
    },
    async findById(id: string): Promise<WithId<Post> | null> {
        return PostsCollection.findOne({ _id: new ObjectId(id)});
    },

    // Создать новый блог
    async create(newPost: Post): Promise<WithId<Post>> {
        const insertResult= await PostsCollection.insertOne(newPost);
        return { ...newPost, _id: insertResult.insertedId};
    },

    // Обновить данные блога
    async update(id: string, body: PostInputModel): Promise<void> {
        const updateResult = await PostsCollection.updateOne(


            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    title:body.title,             // макс. 30 символов
                    shortDescription: body.shortDescription,  // макс. 100 символов
                    content: body.content,           // макс. 1000 символов
                    blogId: body.blogId,
                    //blogName:body.blogName,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new Error('Post not exist');
        }
        return;
    },


    // Удалить блог
    async delete(id: string): Promise <void> {
        const deleteResult = await PostsCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new Error('Blog not exist')
        }
    },
};
