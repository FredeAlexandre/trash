import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

export const sqlite = new Database("sqlite.db");
export const database = drizzle(sqlite);

sqlite.exec("PRAGMA journal_mode = WAL;");
