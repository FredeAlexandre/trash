import chalk from "chalk";
import { SlashCommandBuilder } from "discord.js";
import type { SlashCommandSubcommandsOnlyBuilder } from "discord.js";

import type { Action, CommandAction, Interaction } from "./command-action";
import type { CreateSubcommand } from "./create-subcommand";
import type { CreateSubcommandGroup } from "./create-subcommand-group";

export class CreateCommand
	extends SlashCommandBuilder
	implements CommandAction
{
	action?: Action;

	private subcommands: CreateSubcommand[] = [];
	private groups: CreateSubcommandGroup[] = [];

	setAction(action: Action) {
		this.action = action;
		return this;
	}

	addSubcommandGroup(input: CreateSubcommandGroup): this {
		super.addSubcommandGroup(input);
		this.groups.push(input);
		return this;
	}

	addSubcommand(input: CreateSubcommand): this {
		super.addSubcommand(input);
		this.subcommands.push(input);
		return this;
	}

	private useAction() {
		return this.groups.length === 0 || this.subcommands.length === 0;
	}

	async run(interaction: Interaction) {
		if (this.useAction()) {
			if (this.action) {
				await this.action(interaction);
			} else {
				await interaction.reply({
					content: "This command does not have an action!",
					ephemeral: true,
				});
			}
		} else {
			if (this.action) {
				console.log(
					chalk.yellow(
						`Warning: The command ${this.name} has subcommands/groups and an action. The action will be ignored.`,
					),
				);
			}
			const groupName = interaction.options.getSubcommandGroup();
			if (groupName) {
				const group = this.groups.find((group) => group.name === groupName);
				if (group) {
					await group.run(interaction);
				} else {
					await interaction.reply({
						content: "This subcommand group doesn't exist!",
						ephemeral: true,
					});
				}
			} else {
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
			}
		}
		return this;
	}
}
