import chalk from "chalk";
import { Events } from "discord.js";

import { client } from "@/services/client";

client.once(Events.ClientReady, (readyClient) => {
	console.log(
		chalk.bold(`Client is connected as ${chalk.blue(readyClient.user.tag)}`),
	);
});
