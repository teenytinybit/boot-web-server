import express from "express";
import { handlerReadiness } from "../handlers/readiness.js";
import { handlerCreateUser, handlerLogin } from "../handlers/users.js";
import { handlerGetChirps, handlerCreateChirp, handlerGetChirp } from "../handlers/chirps.js";
import { validateCreateUser, validateLoginUser } from "../validators/users.js";

const apiRouter = express.Router();

apiRouter.get("/healthz", handlerReadiness);
apiRouter.post("/users", validateCreateUser, handlerCreateUser);
apiRouter.post("/login", validateLoginUser, handlerLogin);

apiRouter.get("/chirps/:chirpId", handlerGetChirp);
apiRouter.get("/chirps", handlerGetChirps);
apiRouter.post("/chirps", handlerCreateChirp);

export default apiRouter;
