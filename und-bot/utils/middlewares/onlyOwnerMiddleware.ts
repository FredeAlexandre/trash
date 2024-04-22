import { DiscordInteractionHelper } from "utils/discord";

async function onlyOwnerMiddleware(helper: DiscordInteractionHelper) {
  if (!(await helper.onlyOwner())) throw new Error("onlyOwnerMiddleware");
}

export default onlyOwnerMiddleware;
