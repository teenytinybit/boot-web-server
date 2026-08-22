import express from "express";
import { handlerMetrics, handlerMetricsReset } from "../handlers/metrics";

const adminRouter = express.Router();

adminRouter.get("/metrics", handlerMetrics);
adminRouter.post("/reset", handlerMetricsReset);

export default adminRouter;
