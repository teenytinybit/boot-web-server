import express from "express";
import { handlerReadiness } from "../handlers/readiness.js";
import { handlerCreateUser } from "../handlers/users.js";
import { handlerCreateChirp } from "../handlers/chirps.js";

const apiRouter = express.Router();

apiRouter.get("/healthz", handlerReadiness);
apiRouter.post("/users", handlerCreateUser);
apiRouter.post("/chirps", handlerCreateChirp);

export default apiRouter;
