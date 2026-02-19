import {BlogInputModel, Blog} from "../domain/BlogModel"
import {ObjectId, WithId} from "mongodb";
import {BlogsCollection} from "../../db/Mongo.db";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {BlogQueryInput} from "../routes/input/blog-query.input";



export const blogRepository = {

    async findMany(queryDto: BlogQueryInput,): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        const {
            pageNumber: rawPageNumber,
            pageSize: rawPageSize,
            // 1. ИСПРАВЛЕНИЕ: Устанавливаем значения по умолчанию для SORTING
            sortBy = 'createdAt', // Используем 'createdAt' по умолчанию
            sortDirection = 'desc', // Используем 'desc' по умолчанию
            searchNameTerm,
            searchCreatedAtTerm,
            searchBlogDescriptionTerm,
        } = queryDto;

        // 2. ИСПРАВЛЕНИЕ: Безопасное преобразование и значения по умолчанию для PAGINATION
        const pageNumber = Number(rawPageNumber) || 1;
        const pageSize = Number(rawPageSize) || 10;

        // Теперь 'skip' вычисляется корректно, без риска NaN
        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}
        }
        if (searchBlogDescriptionTerm) {
            filter.description = {$regex: searchBlogDescriptionTerm, $options: 'i'}
        }
        if (searchCreatedAtTerm) {
            filter.createdAt = {$regex: searchCreatedAtTerm, $options: 'i'}
        }

        // Преобразуем строковое направление в формат MongoDB (1 или -1)
        const mongoSortDirection = sortDirection === 'asc' ? 1 : -1;

        const items = await BlogsCollection
            .find(filter)
            // 3. ИСПРАВЛЕНИЕ: Используем mongoSortDirection
            .sort({[sortBy]: mongoSortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await BlogsCollection.countDocuments(filter);

        return {items, totalCount};
    },


    async findById(id: string): Promise<WithId<Blog> | null> {
        return BlogsCollection.findOne({_id: new ObjectId(id)});
    },
    // В BlogsRepository.ts
    async findByIdOrFail(id: string): Promise<WithId<Blog>> {
        let objectId: ObjectId;

        try {
            objectId = new ObjectId(id); // ⬅️ Оборачиваем потенциально проблемный вызов
        } catch (e) {
            // Если ID невалиден (не 24 hex), просто выбрасываем "Не найдено"
            // Это более безопасно, чем падать
            throw new RepositoryNotFoundError('Blog not exist');
        }

        // Ищем уже по безопасному objectId
        const res = await BlogsCollection.findOne({_id: objectId});

        if (!res) {
            throw new RepositoryNotFoundError('Blog not exist');
        }
        return res;
    },
    // Создать новый блог
    async create(newBlog: Blog): Promise<string> {
        const insertResult = await BlogsCollection.insertOne(newBlog);


        return insertResult.insertedId.toString();
    },

    // Обновить данные блога
    async update(id: string, body: BlogInputModel): Promise<void> {
        const updateResult = await BlogsCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError('Blog not exist');
        }
        return;
    },


    // Удалить блог
    async delete(id: string): Promise<void> {
        const deleteResult = await BlogsCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Blog not exist')
        }
        return;
    },
};