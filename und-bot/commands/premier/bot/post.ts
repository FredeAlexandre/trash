import premier from "../../../services/premier";
import { DiscordInteractionHelper } from "../../../utils";

export const name = "post";

export const description = "Re post the matches" as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  await premier.post();
  await premier.backupMatches();
  await helper.finish("The matches have been re posted");
};
