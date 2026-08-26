import express from "express";
import { handlerCreateChirp, handlerGetChirp, handlerGetChirps } from "../handlers/chirps.js";
import { handlerReadiness } from "../handlers/readiness.js";
import { handlerCreateUser, handlerLogin } from "../handlers/users.js";
import { validateCreateChirp } from "../validators/chirps.js";
import { validateCreateUser, validateLoginUser } from "../validators/users.js";

const apiRouter = express.Router();

apiRouter.get("/healthz", handlerReadiness);
apiRouter.post("/users", validateCreateUser, handlerCreateUser);
apiRouter.post("/login", validateLoginUser, handlerLogin);

apiRouter.get("/chirps/:chirpId", handlerGetChirp);
apiRouter.get("/chirps", handlerGetChirps);
apiRouter.post("/chirps", validateCreateChirp, handlerCreateChirp);

export default apiRouter;
