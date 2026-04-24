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
exports.getBlogPostListHandler = getBlogPostListHandler;
const Posts_service_1 = require("../../../Posts/application/Posts.service");
const errors_handler_1 = require("../../../core/errors/errors.handler");
const MapToPostListPaginatedOutput_1 = require("../../../Posts/routes/mappers/MapToPostListPaginatedOutput");
const http_statuses_1 = require("../../../core/types/http-statuses");
function getBlogPostListHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blogId = req.params.blogId;
            const input = req.query;
            const pageNumber = Number(input.pageNumber) || 1;
            const pageSize = Number(input.pageSize) || 10;
            const { items, totalCount } = yield Posts_service_1.PostsService.findPostByBlog(Object.assign(Object.assign({}, input), { pageNumber, pageSize }), blogId);
            const dto = (0, MapToPostListPaginatedOutput_1.mapToPostListPaginatedOutput)(items, {
                pageNumber,
                pageSize,
                totalCount,
            });
            res.status(http_statuses_1.HttpStatus.Ok).send(dto);
        }
        catch (e) {
            (0, errors_handler_1.errorsHandler)(e, res);
        }
    });
}
//# sourceMappingURL=get-blog-post-list.handler.js.map