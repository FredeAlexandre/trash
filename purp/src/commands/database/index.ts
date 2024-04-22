import { CreateCommand } from "@/utils/create-command";

import { add } from "./add";
import { query } from "./query";

export const database = new CreateCommand()
	.setName("database")
	.setDescription("Interact directly with the data in database")
	.addSubcommandGroup(add)
	.addSubcommand(query);
