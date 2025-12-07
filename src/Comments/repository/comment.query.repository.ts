import {IPagination} from "../../core/pagination/pagination";
import {CommentsCollection} from "../../db/Mongo.db";
import {ObjectId, WithId} from "mongodb";
import {ICommentView} from "../types/comment.view.interface";
import {ICommentDB} from "../types/comment.db.interface";
import {SortQueryFilterNumberType} from "../../core/pagination/sortQueryFilter.ntype";

export const commentsQwRepository = {
    //
    async findAllComments(
        postId: string,
        sortQueryDto: SortQueryFilterNumberType, // ✅ Используем объединенный чистый тип
    ): Promise<IPagination<ICommentView[]>> {

        // 1. Деструктуризация всех данных (без as any, без дефолтов)
        const {
            sortBy,
            sortDirection,
            pageSize,
            pageNumber,
        } = sortQueryDto; // 👈 TypeScript теперь уверен во всех полях

        // 2. Формирование фильтра
        const filter: any = {postId: postId};

        // 3. Подсчет общего количества документов
        const totalCount = await CommentsCollection.countDocuments(filter);

        // 4. Получение отфильтрованных, отсортированных и пагинированных данных
        const comments = await CommentsCollection
            .find(filter)
            // ✅ MongoDB доволен
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        // 5. Формирование объекта пагинации
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
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