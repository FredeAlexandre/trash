import chalk from "chalk";
import { Client, GatewayIntentBits } from "discord.js";

import { env } from "./env";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

try {
	client.login(env.TOKEN);
} catch (error) {
	console.error(chalk.red(error));
	process.exit(1);
}
