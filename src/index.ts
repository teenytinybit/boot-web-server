import express from "express";
import { handlerReadiness } from "./handlers/readiness";
import { middlewareLogResponses } from "./middleware/logger";

const app = express();
const port = 8080;

app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness);
app.use(middlewareLogResponses);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
