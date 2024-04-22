import { SlashCommandSubcommandBuilder } from "discord.js";

import type { Action, CommandAction, Interaction } from "./command-action";

export class CreateSubcommand
	extends SlashCommandSubcommandBuilder
	implements CommandAction
{
	action?: Action;

	setAction(action: Action) {
		this.action = action;
		return this;
	}

	async run(interaction: Interaction) {
		if (this.action) {
			await this.action(interaction);
		} else {
			await interaction.reply({
				content: "This command does not have an action!",
				ephemeral: true,
			});
		}
		return this;
	}
}
