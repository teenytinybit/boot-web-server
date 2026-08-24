import express, { NextFunction, Request, Response } from "express";
import { middlewareLogResponses } from "./middleware/logger.js";
import { middlewareMetricsInc } from "./middleware/metrics.js";
import adminRouter from "./routes/admin.js";
import { ChirpValidationError, NotFoundError } from "./errors.js";
import apiRouter from "./routes/api.js";

const app = express();
const port = 8080;
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use("/api", apiRouter);
app.use("/admin", adminRouter);
app.use(middlewareLogResponses);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  } else if (err instanceof ChirpValidationError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Something went wrong on our end" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
