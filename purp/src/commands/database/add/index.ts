import { CreateSubcommandGroup } from "@/utils/create-subcommand-group";

import { recipe } from "./recipe";

export const add = new CreateSubcommandGroup()
	.setName("add")
	.setDescription("Add data to database")
	.addSubcommand(recipe);
