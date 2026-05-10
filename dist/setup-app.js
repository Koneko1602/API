"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const blog_router_1 = require("./Blogs/routes/blog.router");
const paths_1 = require("./core/paths/paths");
const post_router_rs_1 = require("./Posts/routes/post.router.rs");
const Test_router_1 = require("./tests/routers/Test.router");
const users_router_1 = require("./Users/routes/users.router");
const auth_router_1 = require("./Authorization/routes/auth.router");
const comment_router_1 = require("./Comments/routes/comment.router");
const security_router_1 = require("./Authorization/routes/security.router");
const setupApp = (app) => {
    app.use(express_1.default.json()); // middleware для парсинга JSON в теле запроса
    app.use((0, cookie_parser_1.default)());
    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Test!");
    });
    app.use(paths_1.TESTS_PATH, Test_router_1.TestRouter);
    app.use(paths_1.BLOGS_PATH, blog_router_1.BlogRouter);
    app.use(paths_1.POSTS_PATH, post_router_rs_1.PostRouter);
    app.use(paths_1.USERS_PATH, users_router_1.usersRouter);
    app.use(paths_1.AUTH_PATH, auth_router_1.authRouter);
    app.use(paths_1.COMM_PATH, comment_router_1.commentRouter);
    app.use(paths_1.Security_PATH, security_router_1.securityRouter);
    return app;
};
exports.setupApp = setupApp;
//# sourceMappingURL=setup-app.js.map