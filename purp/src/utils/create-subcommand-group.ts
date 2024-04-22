import { SlashCommandSubcommandGroupBuilder } from "discord.js";

import chalk from "chalk";
import type { Action, CommandAction, Interaction } from "./command-action";
import type { CreateSubcommand } from "./create-subcommand";

export class CreateSubcommandGroup
	extends SlashCommandSubcommandGroupBuilder
	implements CommandAction
{
	action?: Action;

	private subcommands: CreateSubcommand[] = [];

	setAction(action: Action) {
		this.action = action;
		return this;
	}

	addSubcommand(input: CreateSubcommand): this {
		super.addSubcommand(input);
		this.subcommands.push(input);
		return this;
	}

	async run(interaction: Interaction) {
		if (this.action) {
			console.log(
				chalk.yellow(
					`Warning: The subcommand group ${this.name} has an action. The action will be ignored.`,
				),
			);
		}
		const subcommandName = interaction.options.getSubcommand();
		const subcommand = this.subcommands.find(
			(subcommand) => subcommand.name === subcommandName,
		);
		if (subcommand) {
			await subcommand.run(interaction);
		} else {
			await interaction.reply({
				content: "This subcommand doesn't exist!",
				ephemeral: true,
			});
		}
		return this;
	}
}
