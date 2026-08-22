import express, { NextFunction, Request, Response } from "express";
import { middlewareLogResponses } from "./middleware/logger";
import { middlewareMetricsInc } from "./middleware/metrics";
import adminRouter from "./routes/admin";
import apiRouter from "./routes/api";

const app = express();
const port = 8080;
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use("/api", apiRouter);
app.use("/admin", adminRouter);
app.use(middlewareLogResponses);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.status(500).json({ error: "Something went wrong on our end" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
