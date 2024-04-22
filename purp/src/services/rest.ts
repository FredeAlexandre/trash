import { REST } from "discord.js";

import { env } from "./env";

export const rest = new REST().setToken(env.TOKEN);
