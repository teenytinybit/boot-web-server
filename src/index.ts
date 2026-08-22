import express from "express";
import { middlewareLogResponses } from "./middleware/logger";
import { middlewareMetricsInc } from "./middleware/metrics";
import apiRouter from "./routes/api";
import adminRouter from "./routes/admin";

const app = express();
const port = 8080;
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use("/api", apiRouter);
app.use("/admin", adminRouter);
app.use(middlewareLogResponses);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
