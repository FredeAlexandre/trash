import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { Option, OptionTypeToTypescript } from "./types";

import getOption from "./getOption";

const getOptions = <T extends Readonly<Option[]>>(
  interaction: ChatInputCommandInteraction<CacheType>,
  options: T
): { [K in keyof T]: OptionTypeToTypescript<T[K]> } => {
  const result: any[] = [];
  for (const option of options) {
    result.push(getOption(interaction, option));
  }
  return result as any;
};

export default getOptions;
