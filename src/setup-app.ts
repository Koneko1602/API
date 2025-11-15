import express, {Express, Request, Response} from "express";
import {BlogRouter} from "./Blogs/routes/blog.router";
import {AUTH_PATH, BLOGS_PATH, POSTS_PATH, TESTS_PATH, USERS_PATH} from "./core/paths/paths";
import {PostRouter} from "./Posts/routes/post.router.rs";
import {TestRouter} from "./tests/routers/Test.router";
import {usersRouter} from "./Users/routes/users.router";
import {authRouter} from "./Authorization/api/auth.router";

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req: Request, res: Response) => {
        res.status(200).send("Test!");

    });



    app.use(TESTS_PATH,TestRouter);
    app.use(BLOGS_PATH,BlogRouter);
    app.use(POSTS_PATH,PostRouter);
    app.use(USERS_PATH,usersRouter);
    app.use(AUTH_PATH,authRouter);
    return app;
}