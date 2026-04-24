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
exports.createCommentForPostController = createCommentForPostController;
const http_statuses_1 = require("../../../core/types/http-statuses");
const Comments_service_1 = require("../../../Comments/application/Comments.service");
const UserRepository_1 = require("../../../Users/repository/UserRepository");
function createCommentForPostController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 1. ПРОВЕРКА (Убедитесь, что статус 401)
            if (!req.userId) {
                // Если токен невалиден/отсутствует (тест падает с 401)
                return res.sendStatus(http_statuses_1.HttpStatus.Unauthorized);
            }
            const currentUserId = req.userId;
            const postId = req.params.id; // 👈 Имя параметра должно быть правильным
            const inputModel = req.body;
            // 2. Поиск пользователя (если здесь падает, то 403)
            const user = yield UserRepository_1.usersRepository.findById(currentUserId);
            if (!user) {
                // Токен валиден, но пользователя нет в БД (тест падает с 403)
                return res.sendStatus(http_statuses_1.HttpStatus.Forbidden);
            }
            // 3. Создание комментария (если здесь падает, то 404)
            const newComment = yield Comments_service_1.CommentsService.createComment(postId, inputModel, { userId: user._id.toString(), userLogin: user.login });
            if (!newComment) {
                // Пост не найден
                return res.sendStatus(http_statuses_1.HttpStatus.NotFound);
            }
            // 4. УСПЕХ (Тест проходит с 201)
            return res.status(http_statuses_1.HttpStatus.Created).send(newComment);
        }
        catch (e) {
            // ...
            return res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
        }
    });
}
//# sourceMappingURL=create-comment.handler.js.map