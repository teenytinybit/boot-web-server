import express from "express";
import { handlerReadiness } from "../handlers/readiness";
import { handlerValidateChirp } from "../handlers/validateChirp";

const apiRouter = express.Router();

apiRouter.get("/healthz", handlerReadiness);
apiRouter.post("/validate_chirp", handlerValidateChirp);
export default apiRouter;
