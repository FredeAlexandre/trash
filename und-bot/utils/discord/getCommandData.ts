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
  builder: SlashCommandSubcommandBuilder,
  option: AttachmentOption
) => {
  builder.addAttachmentOption((opt) => setBaseOption(opt, option));
};

const addBoolean = (
  builder: SlashCommandSubcommandBuilder,
  option: BooleanOption
) => {
  builder.addBooleanOption((opt) => setBaseOption(opt, option));
};

const addChannel = (
  builder: SlashCommandSubcommandBuilder,
  option: ChannelOption
) => {
  builder.addChannelOption((opt) => {
    opt = setBaseOption(opt, option);
    if (option.channel_types) opt.addChannelTypes(option.channel_types);
    return opt;
  });
};

const addInteger = (
  builder: SlashCommandSubcommandBuilder,
  option: IntegerOption
) => {
  builder.addIntegerOption((opt) =>
    setChoices(setMaxMinOption(setBaseOption(opt, option), option), option)
  );
};

const addMentionable = (
  builder: SlashCommandSubcommandBuilder,
  option: MentionableOption
) => {
  builder.addMentionableOption((opt) => setBaseOption(opt, option));
};

const addNumber = (
  builder: SlashCommandSubcommandBuilder,
  option: NumberOption
) => {
  builder.addNumberOption((opt) =>
    setChoices(setMaxMinOption(setBaseOption(opt, option), option), option)
  );
};

const addRole = (
  builder: SlashCommandSubcommandBuilder,
  option: RoleOption
) => {
  builder.addRoleOption((opt) => setBaseOption(opt, option));
};

const addString = (
  builder: SlashCommandSubcommandBuilder,
  option: StringOption
) => {
  builder.addStringOption((opt) =>
    setChoices(setBaseOption(opt, option), option)
  );
};

const addUser = (
  builder: SlashCommandSubcommandBuilder,
  option: UserOption
) => {
  builder.addUserOption((opt) => setBaseOption(opt, option));
};

function getCommandData({
  name,
  description,
  subcommands,
}: {
  name: string;
  description: string;
  subcommands?: {
    name: string;
    description: string;
    options: Readonly<Option[]>;
  }[];
}) {
  const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description);

  if (subcommands) {
    subcommands.forEach((subcommand) =>
      builder.addSubcommand((sub) => {
        sub.setName(subcommand.name).setDescription(subcommand.description);
        subcommand.options.forEach((option) => {
          switch (option.type) {
            case ApplicationCommandOptionType.Attachment:
              addAttachement(sub, option);
              break;
            case ApplicationCommandOptionType.Boolean:
              addBoolean(sub, option);
              break;
            case ApplicationCommandOptionType.Channel:
              addChannel(sub, option);
              break;
            case ApplicationCommandOptionType.Integer:
              addInteger(sub, option);
              break;
            case ApplicationCommandOptionType.Mentionable:
              addMentionable(sub, option);
              break;
            case ApplicationCommandOptionType.Number:
              addNumber(sub, option);
              break;
            case ApplicationCommandOptionType.Role:
              addRole(sub, option);
              break;
            case ApplicationCommandOptionType.String:
              addString(sub, option);
              break;
            case ApplicationCommandOptionType.User:
              addUser(sub, option);
              break;
          }
        });
        return sub;
      })
    );
  }
  return builder;
}

export default getCommandData;
