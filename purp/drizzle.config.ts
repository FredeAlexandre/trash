import type { Config } from "drizzle-kit";

const config: Config = {
	schema: "./src/schema/*",
	out: "./drizzle",
	driver: "better-sqlite",
};

export default config;
