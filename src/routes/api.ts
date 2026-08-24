import express from "express";
import { handlerReadiness } from "../handlers/readiness.js";
import { handlerValidateChirp } from "../handlers/validateChirp.js";
import { handlerCreateUser } from "../handlers/users.js";

const apiRouter = express.Router();

apiRouter.get("/healthz", handlerReadiness);
apiRouter.post("/validate_chirp", handlerValidateChirp);
apiRouter.post("/users", handlerCreateUser);
export default apiRouter;
