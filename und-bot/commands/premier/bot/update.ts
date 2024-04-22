import premier from "../../../services/premier";
import { DiscordInteractionHelper } from "../../../utils";

export const name = "update";

export const description = "Re post the matches" as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  await premier.stop();
  await premier.update();
  await helper.finish("The matches have been re posted");
};
