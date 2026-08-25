import express from "express";
import { handlerReadiness } from "../handlers/readiness.js";
import { handlerCreateUser } from "../handlers/users.js";
import { handlerGetChirps, handlerCreateChirp, handlerGetChirp } from "../handlers/chirps.js";

const apiRouter = express.Router();

apiRouter.get("/healthz", handlerReadiness);
apiRouter.post("/users", handlerCreateUser);

apiRouter.get("/chirps/:chirpId", handlerGetChirp);
apiRouter.get("/chirps", handlerGetChirps);
apiRouter.post("/chirps", handlerCreateChirp);

export default apiRouter;
