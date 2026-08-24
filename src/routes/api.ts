import express from "express";
import { handlerReadiness } from "../handlers/readiness.js";
import { handlerCreateUser } from "../handlers/users.js";

const apiRouter = express.Router();

apiRouter.get("/healthz", handlerReadiness);
apiRouter.post("/users", handlerCreateUser);
export default apiRouter;
