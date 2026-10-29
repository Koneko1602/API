
import express from "express";
import { setupApp } from "./setup-app";

const app = express();

setupApp(app);
app.set("trust proxy", true);

export default app;
