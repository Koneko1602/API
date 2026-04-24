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
exports.getPostListHandler = getPostListHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const Posts_service_1 = require("../../application/Posts.service");
const MapToPostListPaginatedOutput_1 = require("../mappers/MapToPostListPaginatedOutput");
function getPostListHandler(req, // Используем req.query
res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryDto = req.query;
            // 1. Убедитесь, что pageNumber/pageSize здесь безопасно обрабатываются
            const pageNumber = Number(queryDto.pageNumber) || 1;
            const pageSize = Number(queryDto.pageSize) || 10;
            // 2. Получаем данные из сервиса
            const { items, totalCount } = yield Posts_service_1.PostsService.findMany(Object.assign(Object.assign({}, queryDto), { pageNumber,
                pageSize }));
            // 3. Создаем DTO пагинации
            const dto = (0, MapToPostListPaginatedOutput_1.mapToPostListPaginatedOutput)(items, {
                pageNumber,
                pageSize,
                totalCount,
            });
            // 4. ✅ ОТПРАВЛЯЕМ DTO В ОТВЕТЕ
            res.status(http_statuses_1.HttpStatus.Ok).send(dto); // 👈 Передаём 'dto' в send()
        }
        catch (e) {
        }
    });
}
//# sourceMappingURL=get-post-list.handler.js.map