import express from "express";
import { handlerMetrics, handlerReset } from "../handlers/metrics.js";

const adminRouter = express.Router();

adminRouter.get("/metrics", handlerMetrics);
adminRouter.post("/reset", handlerReset);

export default adminRouter;
