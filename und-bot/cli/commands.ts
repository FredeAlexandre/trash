import { Command, GroupSubCommand, SubCommand } from "../types";
import commands from "../commands";
import { Option } from "../utils";
import { ApplicationCommandOptionType } from "discord.js";

const typeToString = (optionType: ApplicationCommandOptionType) => {
  switch (optionType) {
    case ApplicationCommandOptionType.Attachment:
      return "Attachement";
    case ApplicationCommandOptionType.Boolean:
      return "Boolean";
    case ApplicationCommandOptionType.Channel:
      return "Channel";
    case ApplicationCommandOptionType.Integer:
      return "Integer";
    case ApplicationCommandOptionType.Mentionable:
      return "Mentionable";
    case ApplicationCommandOptionType.Number:
      return "Number";
    case ApplicationCommandOptionType.Role:
      return "Role";
    case ApplicationCommandOptionType.String:
      return "String";
    case ApplicationCommandOptionType.Subcommand:
      return "Subcommand";
    case ApplicationCommandOptionType.SubcommandGroup:
      return "SubcommandGroup";
    case ApplicationCommandOptionType.User:
      return "User";
    default:
      return "Unknown";
  }
};

const optionsToString = (options?: Readonly<Option[]>) => {
  if (!options) return "";
  return options
    .map((o) => `[${o.name}${o.required ? "" : "?"}: ${typeToString(o.type)}]`)
    .join(" ");
};

const showCommand = (command: Command, prefix = "") => {
  if (!command.name) console.log("ERROR");
  console.log(
    "/" + prefix + command.name + " " + optionsToString(command.options)
  );
  console.log(command.description);
};

const showSubCommand = (command: SubCommand, prefix = "") => {
  if (!command.name) console.log("ERROR");
  command.commands.forEach((c) => showCommand(c, prefix + command.name + " "));
};

const showGroupSubCommand = (command: GroupSubCommand) => {
  if (!command.name) console.log("ERROR");
  command.commands.forEach((c) => showCommand(c, command.name + " "));
  command.subcommands.forEach((c) => showSubCommand(c, command.name + " "));
};

commands.forEach((c) => {
  if ("subcommands" in c) return showGroupSubCommand(c);
  if ("commands" in c) return showSubCommand(c);
  showCommand(c);
});
