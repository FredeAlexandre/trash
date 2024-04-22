import { CreateSubcommand } from "@/utils/create-subcommand";

export const query = new CreateSubcommand()
	.setName("query")
	.setDescription("Execute an SQL query");
