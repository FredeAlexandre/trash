import type { CacheType, ChatInputCommandInteraction } from "discord.js";

export type Interaction = ChatInputCommandInteraction<CacheType>;
export type Action = (interaction: Interaction) => Promise<void> | void;

export class CommandAction {
	action?: Action;

	setAction(action: Action) {
		this.action = action;
	}

	async run(interaction: Interaction): Promise<CommandAction> {
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
