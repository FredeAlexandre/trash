import {
  ApplicationCommandOptionType,
  CacheType,
  ChatInputCommandInteraction,
} from "discord.js";
import { Option } from "./types";

const getOption = <const T extends Option>(
  interaction: ChatInputCommandInteraction<CacheType>,
  option: T
): any => {
  switch (option.type) {
    case ApplicationCommandOptionType.Attachment:
      return interaction.options.getAttachment(option.name, option.required);
    case ApplicationCommandOptionType.Boolean:
      return interaction.options.getBoolean(option.name, option.required);
    case ApplicationCommandOptionType.Channel:
      return interaction.options.getChannel(option.name, option.required);
    case ApplicationCommandOptionType.Integer:
      return interaction.options.getInteger(option.name, option.required);
    case ApplicationCommandOptionType.Mentionable:
      return interaction.options.getMentionable(option.name, option.required);
    case ApplicationCommandOptionType.Number:
      return interaction.options.getNumber(option.name, option.required);
    case ApplicationCommandOptionType.Role:
      return interaction.options.getRole(option.name, option.required);
    case ApplicationCommandOptionType.String:
      return interaction.options.getString(option.name, option.required);
    case ApplicationCommandOptionType.User:
      return interaction.options.getUser(option.name, option.required);
    default:
      throw new Error("Invalid option type");
  }
};

export default getOption;
