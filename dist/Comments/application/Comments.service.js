"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const CommentRepository_1 = require("../repository/CommentRepository");
const PostRepository_1 = require("../../Posts/repository/PostRepository");
const comment_query_repository_1 = require("../repository/comment.query.repository");
const resultCode_1 = require("../../Users/common/result/resultCode");
const base_auth_guard_1 = require("../../Authorization/api/guards/base.auth.guard");
exports.CommentsService = {
    createComment(postId, inputModel, commentatorInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const postExists = yield PostRepository_1.postRepository.findById(postId);
            if (!postExists) {
                return null;
            }
            const commentToSave = {
                postId: postId,
                content: inputModel.content,
                commentatorInfo: {
                    userId: commentatorInfo.userId,
                    userLogin: commentatorInfo.userLogin
                },
                createdAt: new Date(),
            };
            const commentId = yield CommentRepository_1.commentsRepository.create(commentToSave);
            const viewModel = {
                id: commentId,
                content: commentToSave.content,
                commentatorInfo: commentToSave.commentatorInfo,
                createdAt: commentToSave.createdAt.toISOString()
            };
            return viewModel;
        });
    },
    findCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Делегируем запрос Query Репозиторию
            const comment = yield comment_query_repository_1.commentsQwRepository.findById(id);
            // 2. Если комментарий не найден
            if (!comment) {
                return {
                    status: resultCode_1.ResultStatus.NotFound, // 💡 Статус из resultCode.ts
                    errorMessage: 'Comment not found',
                    extensions: [],
                    data: null, // data: null, так как T = ICommentView
                };
            }
            // 3. Успешный результат
            return {
                status: resultCode_1.ResultStatus.Success, // 💡 Статус из resultCode.ts
                extensions: [],
                data: comment, // Возвращаем ICommentView
            };
        });
    },
    findCommentsForPost(postId, queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. 🛑 БИЗНЕС-ЛОГИКА: Проверка существования поста (для 404)
            const postExists = yield PostRepository_1.postRepository.findById(postId);
            if (!postExists) {
                return {
                    status: resultCode_1.ResultStatus.NotFound, // 💡 Явно сигнализируем о 404
                    errorMessage: 'Post not found',
                    extensions: [],
                    data: null, // Data is null on failure
                };
            }
            // 2. Делегируем запрос Query Repository
            const paginatedComments = yield comment_query_repository_1.commentsQwRepository.findAllComments(postId, queryDto);
            // 3. Успешный результат
            return {
                status: resultCode_1.ResultStatus.Success,
                extensions: [],
                data: paginatedComments,
            };
        });
    },
    updateComment(commentId, userId, // ID пользователя (от Bearer Auth)
    inputModel, authHeader // Сырой заголовок (для Basic Auth)
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            // 💡 400-валидация тела (content) обработана в роутере (Middleware)
            // 1. 🔍 ПРОВЕРКА СУЩЕСТВОВАНИЯ (404 Not Found)
            const comment = yield CommentRepository_1.commentsRepository.findById(commentId);
            if (!comment) {
                return { status: resultCode_1.ResultStatus.NotFound, extensions: [], data: null }; // 404
            }
            // 2. 🛡️ ПРОВЕРКА ПРАВ: Владелец ИЛИ Администратор
            const isOwner = comment.commentatorInfo.userId === userId;
            const isAdmin = authHeader === base_auth_guard_1.ADMIN_TOKEN_HEADER; // Сравнение Basic Auth
            if (!isOwner && !isAdmin) {
                return {
                    status: resultCode_1.ResultStatus.Forbidden, // 403 Forbidden
                    extensions: [],
                    data: null
                };
            }
            // 3. Обновление
            const isUpdated = yield CommentRepository_1.commentsRepository.update(commentId, inputModel.content);
            if (isUpdated) {
                return { status: resultCode_1.ResultStatus.Success, extensions: [], data: null }; // 204 No Content
            }
            return { status: resultCode_1.ResultStatus.BadRequest, extensions: [], data: null };
        });
    },
    deleteComment(commentId, userId, authHeader) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield CommentRepository_1.commentsRepository.findById(commentId);
            if (!comment) {
                return { status: resultCode_1.ResultStatus.NotFound, extensions: [], data: null }; // 404
            }
            // 🛡️ ПРОВЕРКА ПРАВ: Владелец ИЛИ Администратор
            const isOwner = comment.commentatorInfo.userId === userId;
            const isAdmin = authHeader === base_auth_guard_1.ADMIN_TOKEN_HEADER;
            if (!isOwner && !isAdmin) {
                return {
                    status: resultCode_1.ResultStatus.Forbidden, // 403 Forbidden
                    extensions: [],
                    data: null
                };
            }
            // 3. Команда на удаление
            const isDeleted = yield CommentRepository_1.commentsRepository.delete(commentId);
            if (isDeleted) {
                return { status: resultCode_1.ResultStatus.Success, extensions: [], data: null }; // 204 No Content
            }
            return { status: resultCode_1.ResultStatus.BadRequest, extensions: [], data: null };
        });
    }
};
//# sourceMappingURL=Comments.service.js.map