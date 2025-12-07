import {Result} from "../../Users/common/result/result.type";
import {commentsRepository} from "../repository/CommentRepository";
import {Comment, CommentViewModel} from "../domain/CommentsModel";
import {postRepository} from "../../Posts/repository/PostRepository";
import {ICommentDB} from "../types/comment.db.interface";
import {commentatorInfo} from "../domain/commentatorInfo";
import {ICommentView} from "../types/comment.view.interface";
import {commentsQwRepository} from "../repository/comment.query.repository";
import {ResultStatus} from "../../Users/common/result/resultCode";
import {SortQueryFilterNumberType} from "../../core/pagination/sortQueryFilter.ntype";
import {IPagination} from "../../core/pagination/pagination";
import {ADMIN_TOKEN_HEADER} from "../../Authorization/api/guards/base.auth.guard";

type CommentInputModel = { content: string }; // Определяем, что приходит в теле запроса
export const CommentsService = {

    async createComment(
        postId: string,
        inputModel: Comment,
        commentatorInfo: commentatorInfo
    ): Promise<CommentViewModel | null> {


        const postExists = await postRepository.findById(postId);
        if (!postExists) {
            return null;
        }


        const commentToSave: ICommentDB = {
            postId: postId,
            content: inputModel.content,
            commentatorInfo: {
                userId: commentatorInfo.userId,
                userLogin: commentatorInfo.userLogin
            },
            createdAt: new Date(),
        };


        const commentId: string = await commentsRepository.create(commentToSave);


        const viewModel: CommentViewModel = {
            id: commentId,
            content: commentToSave.content,
            commentatorInfo: commentToSave.commentatorInfo,
            createdAt: commentToSave.createdAt.toISOString()
        };

        return viewModel;
    },
    async findCommentById(id: string): Promise<Result<ICommentView>> {
        // 1. Делегируем запрос Query Репозиторию
        const comment = await commentsQwRepository.findById(id);

        // 2. Если комментарий не найден
        if (!comment) {
            return {
                status: ResultStatus.NotFound, // 💡 Статус из resultCode.ts
                errorMessage: 'Comment not found',
                extensions: [],
                data: null as any, // data: null, так как T = ICommentView
            };
        }

        // 3. Успешный результат
        return {
            status: ResultStatus.Success, // 💡 Статус из resultCode.ts
            extensions: [],
            data: comment, // Возвращаем ICommentView
        };
    },
    async findCommentsForPost(
        postId: string,
        queryDto: SortQueryFilterNumberType
    ): Promise<Result<IPagination<ICommentView[]>>> { // Возвращает Result<Пагинация DTO>

        // 1. 🛑 БИЗНЕС-ЛОГИКА: Проверка существования поста (для 404)
        const postExists = await postRepository.findById(postId);

        if (!postExists) {
            return {
                status: ResultStatus.NotFound, // 💡 Явно сигнализируем о 404
                errorMessage: 'Post not found',
                extensions: [],
                data: null as any, // Data is null on failure
            };
        }

        // 2. Делегируем запрос Query Repository
        const paginatedComments = await commentsQwRepository.findAllComments(
            postId,
            queryDto
        );

        // 3. Успешный результат
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: paginatedComments,
        };
    },
    async updateComment(
        commentId: string,
        userId: string | null, // ID пользователя (от Bearer Auth)
        inputModel: CommentInputModel,
        authHeader: string | undefined | null // Сырой заголовок (для Basic Auth)
    ): Promise<Result> {

        // 💡 400-валидация тела (content) обработана в роутере (Middleware)

        // 1. 🔍 ПРОВЕРКА СУЩЕСТВОВАНИЯ (404 Not Found)
        const comment = await commentsRepository.findById(commentId);
        if (!comment) {
            return { status: ResultStatus.NotFound, extensions: [], data: null as any }; // 404
        }

        // 2. 🛡️ ПРОВЕРКА ПРАВ: Владелец ИЛИ Администратор
        const isOwner = comment.commentatorInfo.userId === userId;
        const isAdmin = authHeader === ADMIN_TOKEN_HEADER; // Сравнение Basic Auth

        if (!isOwner && !isAdmin) {
            return {
                status: ResultStatus.Forbidden, // 403 Forbidden
                extensions: [],
                data: null as any
            };
        }

        // 3. Обновление
        const isUpdated = await commentsRepository.update(commentId, inputModel.content);

        if (isUpdated) {
            return { status: ResultStatus.Success, extensions: [], data: null }; // 204 No Content
        }
        return { status: ResultStatus.BadRequest, extensions: [], data: null as any };
    },
    async deleteComment(
        commentId: string,
        userId: string | null,
        authHeader: string | undefined | null
    ): Promise<Result> {

        const comment = await commentsRepository.findById(commentId);
        if (!comment) {
            return { status: ResultStatus.NotFound, extensions: [], data: null as any }; // 404
        }

        // 🛡️ ПРОВЕРКА ПРАВ: Владелец ИЛИ Администратор
        const isOwner = comment.commentatorInfo.userId === userId;
        const isAdmin = authHeader === ADMIN_TOKEN_HEADER;

        if (!isOwner && !isAdmin) {
            return {
                status: ResultStatus.Forbidden, // 403 Forbidden
                extensions: [],
                data: null as any
            };
        }

        // 3. Команда на удаление
        const isDeleted = await commentsRepository.delete(commentId);

        if (isDeleted) {
            return { status: ResultStatus.Success, extensions: [], data: null }; // 204 No Content
        }
        return { status: ResultStatus.BadRequest, extensions: [], data: null as any };
    }
};