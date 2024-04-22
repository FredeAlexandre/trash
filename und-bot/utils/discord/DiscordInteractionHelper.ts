import {
  CacheType,
  ChatInputCommandInteraction,
  MessagePayload,
  InteractionReplyOptions,
  User,
} from "discord.js";

import DiscordLogger from "./DiscordLogger";

import GuildCache from "../../models/GuildCache";
import { Option } from "./types";
import getOptions from "./getOptions";
import getGuild from "./getGuild";

class DiscordInteractionHelper extends DiscordLogger {
  private _title = "";
  private _group = false;
  private _fields: { name: string; value: string; inline?: boolean }[] = [];
  private _isError = false;

  user: User;

  replied = false;

  constructor(public interaction: ChatInputCommandInteraction<CacheType>) {
    super();
    this.setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    });
    this.user = interaction.user;
    this.toggleSuccess();
  }

  async send(
    content: string | MessagePayload | InteractionReplyOptions,
    ephemeral: boolean = false
  ) {
    const payload = this.injectEphemeral(content, ephemeral);
    if (!this.replied) {
      this.replied = true;
      await this.interaction.reply(payload);
    } else {
      await this.interaction.followUp(payload);
    }
    return this;
  }

  async finish(content: string | MessagePayload | InteractionReplyOptions) {
    await Promise.all([
      await this.send(content, this._isError),
      await this.report(),
    ]);
    return this;
  }

  injectEphemeral(
    content: string | MessagePayload | InteractionReplyOptions,
    ephemeral: boolean
  ) {
    let payload: MessagePayload | InteractionReplyOptions;

    if (typeof content === "string") {
      payload = {
        content,
        ephemeral,
      };
    } else if ("body" in content) {
      payload = content;
    } else {
      payload = {
        ephemeral,
        ...content,
      };
    }
    return payload;
  }

  async onlyAdmin() {
    return this.only(await this.isAdmin());
  }

  async isAdmin(user?: User) {
    return await GuildCache.get().isAdmin(user ? user : this.interaction.user);
  }

  async onlyOwner() {
    return this.only(this.isOwner());
  }

  async only(can: boolean) {
    if (!can) {
      await this.toggleError("Unauthorized user").finish(
        "You are not authorized to use this command!"
      );
      return false;
    }
    return true;
  }

  isOwner(user?: User) {
    const guild = getGuild();
    return guild.ownerId == (user ? user.id : this.interaction.user.id);
  }

  async executeSubcommand(
    name: string,
    subcommands: {
      name: string;
      execute: (helper: DiscordInteractionHelper) => Promise<any>;
    }[]
  ) {
    this.setCommandName(name);
    const subcommand = subcommands.find(
      (subcommand) =>
        subcommand.name === this.interaction.options.getSubcommand()
    );
    if (!subcommand) {
      return await this.toggleError(
        "No subcommand found for " + this.interaction.options.getSubcommand()
      ).finish("Subcommand not found !");
    } else {
      this.setSubcommandName(subcommand.name);
      return await subcommand.execute(this);
    }
  }

  setCommandName(name: string) {
    if (this._title == "") {
      this._title = `/${name}`;
    } else {
      const splited_title = this._title.split(" ");
      splited_title[0] = `/${name}`;
      this._title = splited_title.join(" ");
    }
    this.setTitle(this._title);
    return this;
  }

  setSubcommandGroupName(name: string) {
    this._group = true;
    if (this._title == "") throw new Error("You must set command first!");
    const splited_title = this._title.split(" ");
    if (splited_title.length == 1) {
      splited_title.push(name);
    } else {
      splited_title[1] = name;
    }
    this._title = splited_title.join(" ");
    this.setTitle(this._title);
    return this;
  }

  setSubcommandName(name: string) {
    const splited_title = this._title.split(" ");
    if (splited_title.length == 0)
      throw new Error("You must set command name first!");
    if (this._group && splited_title.length == 1)
      throw new Error("You must set group command name first!");
    if (splited_title.length > 2) {
      splited_title[2] = name;
    } else {
      splited_title.push(name);
    }
    this._title = splited_title.join(" ");
    this.setTitle(this._title);
    return this;
  }

  getOptions<T extends Readonly<Option[]>>(options: T) {
    const results = getOptions(this.interaction, options);
    const splited_title = this._title.split(" ");
    results.forEach((result) => {
      splited_title.push(`${result}`);
    });
    this._title = splited_title.join(" ");
    this.setTitle(this._title);
    return results;
  }

  addField(name: string, value: string, inline?: boolean) {
    this._fields.push({ name, value, inline });
    this.setFields(this._fields);
    return this;
  }

  addFields(fields: { name: string; value: string; inline?: boolean }[]) {
    this._fields.push(...fields);
    this.setFields(this._fields);
    return this;
  }

  toggleError(error?: string) {
    this._isError = true;
    this.setDescription(`❌ Failure${error ? `: ${error}` : ""}`).setColor(
      15548997
    );
    return this;
  }

  toggleSuccess() {
    this._isError = false;
    return this.setDescription("✅ Success").setColor(5763719);
  }
}

export default DiscordInteractionHelper;
