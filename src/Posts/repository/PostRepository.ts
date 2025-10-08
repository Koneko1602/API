
import {ObjectId, WithId} from "mongodb";
import {PostsCollection} from "../../db/Mongo.db";
import {Post, PostInputModel} from "../domain/PostModel";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {PostQueryInput} from "../routes/input/post-query.input";




export const postRepository = {
    async findMany ( queryDto:PostQueryInput,): Promise<{items: WithId<Post>[]; totalCount: number}> {
        const {
            pageNumber: rawPageNumber,
            pageSize: rawPageSize,
            // 1. ИСПРАВЛЕНИЕ: Устанавливаем значения по умолчанию для SORTING
            sortBy = 'createdAt', // Используем 'createdAt' по умолчанию
            sortDirection = 'desc', // Используем 'desc' по умолчанию
            searchPostTitleTerm,
            searchPostShortDescriptionTerm,
            searchPostBlogIdTerm,
        } = queryDto;

        // 2. ИСПРАВЛЕНИЕ: Безопасное преобразование и значения по умолчанию для PAGINATION
        const pageNumber = Number(rawPageNumber) || 1;
        const pageSize = Number(rawPageSize) || 10;

        // Теперь 'skip' вычисляется корректно, без риска NaN
        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchPostTitleTerm) {
            filter.title = { $regex: searchPostTitleTerm, $options: 'i'}
        }
        if (searchPostShortDescriptionTerm) {
            filter.shortDescription = { $regex:searchPostShortDescriptionTerm, $options: 'i'}
        }
        if (searchPostBlogIdTerm) {
            filter.blogId = {$regex:searchPostBlogIdTerm, $options: 'i'}
        }

        // Преобразуем строковое направление в формат MongoDB (1 или -1)
        const mongoSortDirection = sortDirection === 'asc' ? 1 : -1;

        const items = await PostsCollection
            .find(filter)
            // 3. ИСПРАВЛЕНИЕ: Используем mongoSortDirection
            .sort({ [ sortBy ]: mongoSortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await PostsCollection.countDocuments(filter);

        return { items, totalCount };
    },

    async findById(id: string): Promise<WithId<Post> | null> {
        let objectId: ObjectId;
        try {
            // Безопасное создание ObjectId
            objectId = new ObjectId(id);
        } catch (e) {
            // Если ID невалиден по формату, мы не можем его найти.
            return null;
        }

        return PostsCollection.findOne({ _id: objectId });
    },


    async findByIdOrFail(id: string): Promise<WithId<Post>> {
        let objectId: ObjectId;

        try {
            objectId = new ObjectId(id);
        } catch (e) {
            // Если ID невалиден, мы не можем его найти. Бросаем RepositoryNotFoundError.
            throw new RepositoryNotFoundError('Post not exist'); // 💡 ИСПРАВЛЕНИЕ: Используйте 'Post not exist'
        }

        const res = await PostsCollection.findOne({ _id: objectId });

        if (!res) {
            throw new RepositoryNotFoundError('Post not exist'); // 💡 ИСПРАВЛЕНИЕ: Используйте 'Post not exist'
        }
        return res;
    },
    // Создать новый блог
    async create(newBlog: Post): Promise<string> {
        const insertResult= await PostsCollection.insertOne(newBlog);


        return  insertResult.insertedId.toString();
    },

    // Обновить данные блога
    async update(id: string, body:PostInputModel): Promise<void> {
        const updateResult = await PostsCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError ('Post not exist');
        }
        return;
    },


    // Удалить блог
    async delete(id: string): Promise <void> {
        const deleteResult = await PostsCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Post not exist')
        }
        return ;
    },


    async findPostByBlog(
        queryDto: PostQueryInput,
        blogId: string,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        const pageNumber = Number(queryDto.pageNumber) || 1;
        const pageSize = Number(queryDto.pageSize) || 10;
        const sortBy = queryDto.sortBy || 'createdAt';
        const sortDirection = queryDto.sortDirection === 'asc' ? 1 : -1;

        const filter = { blogId };
        const skip = (pageNumber - 1) * pageSize;

        const [items, totalCount] = await Promise.all([
            PostsCollection.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            PostsCollection.countDocuments(filter),
        ]);

        return { items, totalCount };
    },
    async insert(post: Post): Promise<WithId<Post>> {
        const result = await PostsCollection.insertOne(post);
        return {
            ...post,
            _id: result.insertedId,
        };
    },
    async findBlogName(postId:string): Promise<WithId<Post> | null> {
        return await PostsCollection.findOne({ blogId: postId  });


    }
};