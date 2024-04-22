import { z } from "zod";

function createEnv<T extends z.ZodRawShape>(schema: T) {
	return z.object(schema).parse(process.env);
}

export const env = createEnv({
	TOKEN: z.string().length(72),
	CLIENT_ID: z.string().length(19),
	CLIENT_SECRET: z.string().length(32),
	NODE_ENV: z.enum(["development", "production"]),
});
