import express from "express";
import { handlerReadiness } from "../handlers/readiness";

const apiRouter = express.Router();

apiRouter.get("/healthz", handlerReadiness);

export default apiRouter;
