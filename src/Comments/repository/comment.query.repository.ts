import {IPagination} from "../../core/pagination/pagination";
import {CommentsCollection} from "../../db/Mongo.db";
import {ObjectId, WithId} from "mongodb";
import {ICommentView} from "../types/comment.view.interface";
import {ICommentDB} from "../types/comment.db.interface";
import {SortQueryFieldsType} from "../../core/pagination/sortQueryFields.type";


export const commentsQwRepository = {
    //
    async findAllComments(
        postId: string,
        // ✅ ИСПРАВЛЕНИЕ: Используем типобезопасный DTO для входящих параметров
        sortQueryDto: SortQueryFieldsType,
    ): Promise<IPagination<ICommentView[]>> {

        // 1. ✅ БЕЗОПАСНОЕ ПРЕОБРАЗОВАНИЕ И ДЕФОЛТЫ

        // Преобразование строки в число, с дефолтом 1, если невалидно
        const pageNumber = Number(sortQueryDto.pageNumber) || 1;
        // Преобразование строки в число, с дефолтом 10, если невалидно
        const pageSize = Number(sortQueryDto.pageSize) || 10;

        // sortBy: строка, по умолчанию 'createdAt'
        const sortBy = sortQueryDto.sortBy || 'createdAt';

        // 🛑 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Преобразование 'asc'/'desc' в 1/-1 для MongoDB
        const rawSortDirection = sortQueryDto.sortDirection || 'desc';
        // ✅ ИСПРАВЛЕНИЕ: Теперь TypeScript знает, что это 1 или -1
        const sortDirectionValue: 1 | -1 = rawSortDirection === 'asc' ? 1 : -1;

        // 2. Формирование фильтра
        // ✅ ИСПРАВЛЕНИЕ: Используем Record<string, any> вместо 'any' для фильтра, если это объект с известными строковыми ключами.
        const filter: Record<string, any> = {postId: postId};

        // 3. Подсчет общего количества документов
        const totalCount = await CommentsCollection.countDocuments(filter);

        // 4. Получение данных
        const comments = await CommentsCollection
            .find(filter)
            .sort({[sortBy]: sortDirectionValue}) // Используем 1/-1
            .skip((pageNumber - 1) * pageSize) // Безопасная математика
            .limit(pageSize)
            .toArray();

        // 5. Формирование объекта пагинации
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: comments.map((u) => this._getInView(u)),
        };
    },
    async findById(id: string): Promise<ICommentView | null> {
        // Проверка формата ID
        if (!ObjectId.isValid(id)) {
            return null;
        }

        const comment = await CommentsCollection.findOne({ _id: new ObjectId(id) });

        return comment ? this._getInView(comment) : null;
    },
    _getInView(comment: WithId<ICommentDB>): ICommentView {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt.toISOString()
        };
    }, //маппинг из внутренней модели базы данных во внешнюю модель для отображения клиенту
}