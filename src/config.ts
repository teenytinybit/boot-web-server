import { MigrationConfig } from "drizzle-orm/migrator";
import { envOrThrow } from "./helpers/index.js";

process.loadEnvFile(".env");

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  fileserverHits: number;
  platform: string;
};

type Config = {
  api: APIConfig;
  db: DBConfig;
};

const apiConfig: APIConfig = { fileserverHits: 0, platform: envOrThrow("PLATFORM") };
const migrationConfig: MigrationConfig = { migrationsFolder: "./src/db/migrations" };

const config: Config = {
  api: apiConfig,
  db: {
    migrationConfig,
    url: envOrThrow("DB_URL"),
  },
};

export default config;
