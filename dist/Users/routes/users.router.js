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
exports.usersRouter = void 0;
const express_1 = require("express");
const base_auth_guard_1 = require("../../Authorization/api/guards/base.auth.guard");
const user_query_repository_1 = require("../repository/user.query.repository");
const sortQueryFields_util_1 = require("../../core/pagination/sortQueryFields.util");
const Users_service_1 = require("../application/Users.service");
const http_statuses_1 = require("../../core/types/http-statuses");
const sorting_pagination_validation_1 = require("../../core/pagination/sorting.pagination.validation");
const validation_user_1 = require("../validation/validation.user");
const input_validation_result_middleware_1 = require("../../core/Middlewares/validation/input-validation-result.middleware");
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.get("/", base_auth_guard_1.baseAuthGuard, sorting_pagination_validation_1.pageNumberValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanSortPagination = (0, sortQueryFields_util_1.sortQueryFieldsUtil)(req.query);
    const { searchLoginTerm, searchEmailTerm } = req.query;
    // 3. 🚀 ФОРМИРУЕМ ПОЛНЫЙ, ЧИСТЫЙ ОБЪЕКТ
    const finalQueryFilter = Object.assign(Object.assign({}, cleanSortPagination), { searchLoginTerm,
        searchEmailTerm });
    const allUsers = yield user_query_repository_1.usersQwRepository.findAllUsers(finalQueryFilter);
    return res.status(200).send(allUsers);
}));
exports.usersRouter.post("/", base_auth_guard_1.baseAuthGuard, validation_user_1.userValidation.passwordValidation, validation_user_1.userValidation.loginValidation, validation_user_1.userValidation.emailValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password, email } = req.body;
    const userId = yield Users_service_1.usersService.create({ login, password, email });
    const newUser = yield user_query_repository_1.usersQwRepository.findById(userId);
    if (!newUser) {
        return res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
    }
    return res.status(http_statuses_1.HttpStatus.Created).send(newUser);
}));
exports.usersRouter.delete("/:id", base_auth_guard_1.baseAuthGuard, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Users_service_1.usersService.delete(req.params.id);
    if (!user)
        return res.sendStatus(404);
    return res.sendStatus(204);
}));
//# sourceMappingURL=users.router.js.map