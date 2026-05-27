import express, {Express, Request, Response} from "express";
import cookieParser from 'cookie-parser';
import {BlogRouter} from "./Blogs/routes/blog.router";
import {AUTH_PATH, BLOGS_PATH, COMM_PATH, POSTS_PATH, Security_PATH, TESTS_PATH, USERS_PATH} from "./core/paths/paths";
import {PostRouter} from "./Posts/routes/post.router.rs";
import {TestRouter} from "./tests/routers/Test.router";
import {usersRouter} from "./Users/routes/users.router";
import {authRouter} from "./Authorization/routes/auth.router";
import {commentRouter} from "./Comments/routes/comment.router";
import {securityRouter} from "./Authorization/routes/security.router";

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса
    app.use(cookieParser());
    // основной роут
    app.get("/", (req: Request, res: Response) => {
        res.status(200).send("Test!");

    });


    app.use(TESTS_PATH, TestRouter);
    app.use(BLOGS_PATH, BlogRouter);
    app.use(POSTS_PATH, PostRouter);
    app.use(USERS_PATH, usersRouter);
    app.use(AUTH_PATH, authRouter);
    app.use(COMM_PATH,commentRouter);
    app.use(Security_PATH,securityRouter)
    return app;
}