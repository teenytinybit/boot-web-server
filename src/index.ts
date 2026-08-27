import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express, { NextFunction, Request, Response } from "express";
import postgres from "postgres";
import config from "./config.js";
import {
  ApiKeyError,
  ValidationError,
  InvalidJWTError,
  NotFoundError,
} from "./errors.js";
import { middlewareLogResponses } from "./middleware/logger.js";
import { middlewareMetricsInc } from "./middleware/metrics.js";
import adminRouter from "./routes/admin.js";
import apiRouter from "./routes/api.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

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
  } else if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  } else if (err instanceof InvalidJWTError || err instanceof ApiKeyError) {
    return res.status(401).json({ error: err.message });
  }
  res.status(500).json({ error: "Something went wrong on our end" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
