import premier from "../../../services/premier";
import { DiscordInteractionHelper } from "../../../utils";

export const name = "ping";

export const description = "Ping all the missing of the team" as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  await premier.ping();
  await helper.finish("Every missing member has been pinged");
};
