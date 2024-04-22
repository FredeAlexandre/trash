import { CreateSubcommand } from "@/utils/create-subcommand";

import { database } from "@/services/database";

import { recipes } from "~/recipes";

export const recipe = new CreateSubcommand()
	.setName("recipe")
	.setDescription("Add a recipe to database")
	.addStringOption((option) =>
		option
			.setName("name")
			.setDescription("The name of the recipe")
			.setRequired(true),
	)
	.addStringOption((option) =>
		option
			.setName("content")
			.setDescription("The recipe as plain text")
			.setRequired(true),
	)
	.setAction(async (interaction) => {
		const name = interaction.options.getString("name", true);
		const content = interaction.options.getString("content", true);
		await database.insert(recipes).values({
			slug: name.toLowerCase().replace(/ /g, "-"),
			name,
			content,
		});
	});
