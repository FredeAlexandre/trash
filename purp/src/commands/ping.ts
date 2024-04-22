import { CreateCommand } from "@/utils/create-command";

export const ping = new CreateCommand()
	.setName("ping")
	.setDescription("Replies with Pong!")
	.setAction(async (interaction) => {
		await interaction.reply({
			content: "Pong!",
			ephemeral: true,
		});
	});
