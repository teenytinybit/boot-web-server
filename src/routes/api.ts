import express from "express";
import {
  handlerCreateChirp,
  handlerDeleteChirp,
  handlerGetChirp,
  handlerGetChirps,
} from "../handlers/chirps.js";
import { handlerReadiness } from "../handlers/readiness.js";
import {
  handlerCreateUser,
  handlerLogin,
  handlerPolkaWebhook,
  handlerRefresh,
  handlerRevoke,
  handlerUpdateUser,
} from "../handlers/users.js";
import { validateCreateChirp } from "../validators/chirps.js";
import {
  validateCreateUser,
  validateLoginUser,
  validateUpdateUser,
} from "../validators/users.js";

const apiRouter = express.Router();

apiRouter.get("/healthz", handlerReadiness);

apiRouter.post("/users", validateCreateUser, handlerCreateUser);
apiRouter.put("/users", validateUpdateUser, handlerUpdateUser);

apiRouter.post("/login", validateLoginUser, handlerLogin);
apiRouter.post("/refresh", handlerRefresh);
apiRouter.post("/revoke", handlerRevoke);
apiRouter.post("/polka/webhooks", handlerPolkaWebhook);

apiRouter.get("/chirps/:chirpId", handlerGetChirp);
apiRouter.delete("/chirps/:chirpId", handlerDeleteChirp);
apiRouter.get("/chirps", handlerGetChirps);
apiRouter.post("/chirps", validateCreateChirp, handlerCreateChirp);

export default apiRouter;
