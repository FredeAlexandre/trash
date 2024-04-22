import { DiscordInteractionHelper } from "utils/discord";

async function onlyAdminMiddleware(helper: DiscordInteractionHelper) {
  if (!(await helper.onlyAdmin())) throw new Error("onlyAdminMiddleware");
}

export default onlyAdminMiddleware;
