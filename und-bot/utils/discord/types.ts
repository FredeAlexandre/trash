import {
  ApplicationCommandOptionType,
  ApplicationCommandOptionAllowedChannelTypes,
  APIApplicationCommandOptionChoice,
  Attachment,
  Channel,
  GuildMember,
  APIInteractionDataResolvedGuildMember,
  Role,
  APIRole,
  User,
} from "discord.js";
import DiscordInteractionHelper from "./DiscordInteractionHelper";

export interface OptionBase {
  name: string;
  description: string;
  required?: boolean;
  type: ApplicationCommandOptionType;
}

export interface OptionMinMaxValue {
  max_value?: number;
  min_value?: number;
}

export interface OptionCompletion<T extends number | string> {
  choices?: APIApplicationCommandOptionChoice<T>;
  autocomplete?: boolean;
}

export interface AttachmentOption extends OptionBase {
  type: ApplicationCommandOptionType.Attachment;
}

export interface BooleanOption extends OptionBase {
  type: ApplicationCommandOptionType.Boolean;
}

export interface ChannelOption extends OptionBase {
  type: ApplicationCommandOptionType.Channel;
  channel_types?: ApplicationCommandOptionAllowedChannelTypes;
}

export interface IntegerOption
  extends OptionBase,
    OptionMinMaxValue,
    OptionCompletion<number> {
  type: ApplicationCommandOptionType.Integer;
}

export interface MentionableOption extends OptionBase {
  type: ApplicationCommandOptionType.Mentionable;
}

export interface NumberOption
  extends OptionBase,
    OptionMinMaxValue,
    OptionCompletion<number> {
  type: ApplicationCommandOptionType.Number;
}

export interface RoleOption extends OptionBase {
  type: ApplicationCommandOptionType.Role;
}

export interface StringOption extends OptionBase, OptionCompletion<string> {
  type: ApplicationCommandOptionType.String;
  max_length?: number;
  min_length?: number;
}

export interface UserOption extends OptionBase {
  type: ApplicationCommandOptionType.User;
}

export type Option =
  | AttachmentOption
  | BooleanOption
  | ChannelOption
  | IntegerOption
  | MentionableOption
  | NumberOption
  | RoleOption
  | StringOption
  | UserOption;

export type OptionTypeToTypescript<T extends Option> =
  T extends AttachmentOption
    ? Attachment
    : T extends BooleanOption
    ? boolean
    : T extends ChannelOption
    ? Channel
    : T extends IntegerOption
    ? number
    : T extends MentionableOption
    ? NonNullable<
        | GuildMember
        | APIInteractionDataResolvedGuildMember
        | Role
        | APIRole
        | User
        | null
        | undefined
      >
    : T extends NumberOption
    ? number
    : T extends RoleOption
    ? Role | APIRole
    : T extends StringOption
    ? string
    : T extends UserOption
    ? User
    : never;

export type CommandModule = {
  name: string;
  description: string;
  options?: Option[];
  execute: (helper: DiscordInteractionHelper) => Promise<any>;
};

export type SubCommandModule = {
  name: string;
  description: string;
  subcommands: CommandModule[];
  execute: (
    helper: DiscordInteractionHelper,
    subcommands: CommandModule[]
  ) => Promise<any>;
};

export type GroupCommandModule = {
  name: string;
  description: string;
  groups: SubCommandModule[];
  subcommands: CommandModule[];
  execute: (
    helper: DiscordInteractionHelper,
    groups: SubCommandModule[],
    subcommands: CommandModule[]
  ) => Promise<any>;
};
