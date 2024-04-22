import { Command, GroupSubCommand, SubCommand } from "types";
import {
  AttachmentOption,
  BooleanOption,
  ChannelOption,
  IntegerOption,
  MentionableOption,
  NumberOption,
  RoleOption,
  StringOption,
  UserOption,
  OptionMinMaxValue,
  Option,
  OptionCompletion,
} from "../index";

import {
  ApplicationCommandOptionType,
  SlashCommandSubcommandBuilder,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  ApplicationCommandOptionBase,
  ApplicationCommandNumericOptionMinMaxValueMixin,
  ApplicationCommandOptionWithChoicesAndAutocompleteMixin,
} from "discord.js";

const setBaseOption = <T extends ApplicationCommandOptionBase>(
  opt: T,
  option: Option
) => {
  opt.setName(option.name).setDescription(option.description);
  if (option.required) opt.setRequired(option.required);
  return opt;
};

const setMaxMinOption = <
  T extends ApplicationCommandNumericOptionMinMaxValueMixin
>(
  opt: T,
  option: OptionMinMaxValue
) => {
  if (option.max_value) opt.setMaxValue(option.max_value);
  if (option.min_value) opt.setMinValue(option.min_value);
  return opt;
};

const setChoices = <
  C extends string | number,
  T extends ApplicationCommandOptionWithChoicesAndAutocompleteMixin<C>
>(
  opt: T,
  option: OptionCompletion<C>
) => {
  if (option.choices) opt.setChoices(option.choices);
  if (option.autocomplete) opt.setAutocomplete(option.autocomplete);
  return opt;
};

const addAttachement = (
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  option: AttachmentOption
) => {
  builder.addAttachmentOption((opt) => setBaseOption(opt, option));
};

const addBoolean = (
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  option: BooleanOption
) => {
  builder.addBooleanOption((opt) => setBaseOption(opt, option));
};

const addChannel = (
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  option: ChannelOption
) => {
  builder.addChannelOption((opt) => {
    opt = setBaseOption(opt, option);
    if (option.channel_types) opt.addChannelTypes(option.channel_types);
    return opt;
  });
};

const addInteger = (
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  option: IntegerOption
) => {
  builder.addIntegerOption((opt) =>
    setChoices(setMaxMinOption(setBaseOption(opt, option), option), option)
  );
};

const addMentionable = (
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  option: MentionableOption
) => {
  builder.addMentionableOption((opt) => setBaseOption(opt, option));
};

const addNumber = (
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  option: NumberOption
) => {
  builder.addNumberOption((opt) =>
    setChoices(setMaxMinOption(setBaseOption(opt, option), option), option)
  );
};

const addRole = (
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  option: RoleOption
) => {
  builder.addRoleOption((opt) => setBaseOption(opt, option));
};

const addString = (
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  option: StringOption
) => {
  builder.addStringOption((opt) =>
    setChoices(setBaseOption(opt, option), option)
  );
};

const addUser = (
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  option: UserOption
) => {
  builder.addUserOption((opt) => setBaseOption(opt, option));
};

function injectOptions<
  T extends SlashCommandBuilder | SlashCommandSubcommandBuilder
>(builder: T, options?: Readonly<Option[]>) {
  if (!options) return builder;
  options.forEach((option) => {
    switch (option.type) {
      case ApplicationCommandOptionType.Attachment:
        addAttachement(builder, option);
        break;
      case ApplicationCommandOptionType.Boolean:
        addBoolean(builder, option);
        break;
      case ApplicationCommandOptionType.Channel:
        addChannel(builder, option);
        break;
      case ApplicationCommandOptionType.Integer:
        addInteger(builder, option);
        break;
      case ApplicationCommandOptionType.Mentionable:
        addMentionable(builder, option);
        break;
      case ApplicationCommandOptionType.Number:
        addNumber(builder, option);
        break;
      case ApplicationCommandOptionType.Role:
        addRole(builder, option);
        break;
      case ApplicationCommandOptionType.String:
        addString(builder, option);
        break;
      case ApplicationCommandOptionType.User:
        addUser(builder, option);
        break;
    }
  });
  return builder;
}

function convertCommandToSlashCommandBuilder(command: Command) {
  return injectOptions(
    new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description ?? "No description"),
    command.options
  );
}

function convertSubCommandToSlashCommandBuilder(command: SubCommand) {
  const builder = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription("No description");

  command.commands.forEach((subcommand) => {
    builder.addSubcommand((sub) =>
      injectOptions(
        sub
          .setName(subcommand.name)
          .setDescription(subcommand.description ?? "No description"),
        subcommand.options
      )
    );
  });
  return builder;
}

function convertGroupCommandToSlashCommandBuilder(command: GroupSubCommand) {
  const builder = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription("No description");

  command.subcommands.forEach((group) => {
    builder.addSubcommandGroup((subgroup) => {
      group.commands.forEach((subcommand) => {
        subgroup.addSubcommand((sub) =>
          injectOptions(
            sub
              .setName(subcommand.name)
              .setDescription(subcommand.description ?? "No description"),
            subcommand.options
          )
        );
      });
      return subgroup.setName(group.name).setDescription("No description");
    });
  });

  command.commands.forEach((subcommand) => {
    builder.addSubcommand((sub) =>
      injectOptions(
        sub
          .setName(subcommand.name)
          .setDescription(subcommand.description ?? "No description"),
        subcommand.options
      )
    );
  });
  return builder;
}

function convertToSlashCommandBuilder(
  command: Command | SubCommand | GroupSubCommand
) {
  if ("subcommands" in command) {
    return convertGroupCommandToSlashCommandBuilder(command);
  }
  if ("commands" in command) {
    return convertSubCommandToSlashCommandBuilder(command);
  }
  return convertCommandToSlashCommandBuilder(command);
}

function getApplicationCommandsBody(
  commands: (Command | SubCommand | GroupSubCommand)[]
): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
  const result = commands.map((command) => {
    return convertToSlashCommandBuilder(command);
  });
  return result.map((command) => {
    return command.toJSON();
  });
}

export default getApplicationCommandsBody;
