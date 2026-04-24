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
exports.getBlogListHandler = getBlogListHandler;
const Blogs_service_1 = require("../../application/Blogs.service");
const errors_handler_1 = require("../../../core/errors/errors.handler");
const set_default_sort_and_pagination_1 = require("../../../core/Helpers/set-default-sort-and-pagination");
const http_statuses_1 = require("../../../core/types/http-statuses");
const Map_to_blog_dto_1 = require("../mappers/Map-to-blog-dto");
function getBlogListHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryInput = (0, set_default_sort_and_pagination_1.setDefaultSortAndPaginationIfNotExist)(req.query);
            const { items, totalCount } = yield Blogs_service_1.BlogsService.findMany(queryInput);
            const result = {
                pagesCount: Math.ceil(totalCount / queryInput.pageSize),
                page: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
                items: items.map(Map_to_blog_dto_1.mapToBlogDto), // ← должен возвращать BlogDto[]
            };
            res.status(http_statuses_1.HttpStatus.Ok).send(result);
        }
        catch (e) {
            (0, errors_handler_1.errorsHandler)(e, res);
        }
    });
}
//# sourceMappingURL=get-blog-list.handler.js.map