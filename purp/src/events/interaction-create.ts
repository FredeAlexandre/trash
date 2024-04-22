import chalk from "chalk";
import { Events } from "discord.js";

import { commands } from "@/commands-list";
import { client } from "@/services/client";

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = commands.find(
		(command) => command.name === interaction.commandName,
	);
	if (!command) {
		console.error(chalk.red(`Command not found: ${interaction.commandName}`));
		await interaction.reply({
			content: "This command does not exist!",
			ephemeral: true,
		});
		return;
	}

	try {
		await command.run(interaction);
	} catch (error) {
		console.error(chalk.red(error));
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});
