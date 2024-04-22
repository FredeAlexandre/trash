import type {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { DiscordInteractionHelper, Option } from "./utils";

export type AppCommand = {
  app: string;
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (helper: DiscordInteractionHelper) => any;
};

export type AppModule = {
  commands?: AppCommand[];
};

class MiddlewareModule {
  constructor(
    public middlewares: ((
      helper: DiscordInteractionHelper
    ) => Promise<any>)[] = []
  ) {}

  async middleware(helper: DiscordInteractionHelper) {
    for (let i = 0; i < this.middlewares.length; i++) {
      const middleware = this.middlewares[i];
      try {
        await middleware(helper);
      } catch (error) {
        return false;
      }
    }
    return true;
  }
}

export type ExecuteFun = (helper: DiscordInteractionHelper) => Promise<any>;

export type CommandProps = {
  name: string;
  description?: string;
  options?: Readonly<Option[]>;
  middlewares?: ExecuteFun[];
  execute?: ExecuteFun;
};

export class Command extends MiddlewareModule {
  name: string;
  description?: string;
  options?: Readonly<Option[]>;

  overwrite?: ExecuteFun;

  constructor(props: CommandProps) {
    super(props.middlewares);
    this.name = props.name;
    this.description = props.description;
    this.options = props.options;
    this.overwrite = props.execute;
  }

  async execute(helper: DiscordInteractionHelper) {
    if (!(await this.middleware(helper))) return;
    if (this.overwrite) {
      return await this.overwrite(helper);
    }
    await helper
      .toggleError(`The command ${this.name} has not been implemented !`)
      .finish(`The command ${this.name} has not been implemented !`);
  }
}

export type SubCommandProps = {
  name: string;
  commands: Command[];
  middlewares?: ExecuteFun[];
  execute?: ExecuteFun;
};

export class SubCommand extends MiddlewareModule {
  name: string;
  commands: Command[];

  overwrite?: ExecuteFun;

  constructor(props: SubCommandProps) {
    super(props.middlewares);
    this.name = props.name;
    this.commands = props.commands;
    this.overwrite = props.execute;
  }

  async execute(helper: DiscordInteractionHelper) {
    if (!(await this.middleware(helper))) return;
    if (this.overwrite) {
      return await this.overwrite(helper);
    }
    const subcommand = helper.interaction.options.getSubcommand();
    if (subcommand) {
      helper.setSubcommandName(subcommand);
      const executor = this.commands.find(
        (executor) => executor.name === subcommand
      );
      if (!executor) {
        return await helper
          .toggleError("No subcommand found for " + subcommand)
          .finish("Subcommand not found !");
      } else {
        return await executor.execute(helper);
      }
    }
    return await helper
      .toggleError("No subcommand found for " + subcommand)
      .finish("Subcommand not found !");
  }
}

export type GroupSubCommandProps = {
  name: string;
  commands: Command[];
  subcommands: SubCommand[];
  middlewares?: ExecuteFun[];
  execute?: ExecuteFun;
};

export class GroupSubCommand extends MiddlewareModule {
  name: string;
  commands: Command[];
  subcommands: SubCommand[];

  overwrite?: ExecuteFun;

  constructor(props: GroupSubCommandProps) {
    super(props.middlewares);
    this.name = props.name;
    this.commands = props.commands;
    this.subcommands = props.subcommands;
    this.overwrite = props.execute;
  }

  async execute(helper: DiscordInteractionHelper) {
    if (!(await this.middleware(helper))) return;
    if (this.overwrite) {
      return await this.overwrite(helper);
    }
    const group = helper.interaction.options.getSubcommandGroup();
    if (group) {
      helper.setSubcommandGroupName(group);
      const executor = this.subcommands.find(
        (executor) => executor.name === group
      );
      if (!executor) {
        return await helper
          .toggleError("No subcommand group found for " + group)
          .finish("Subcommand group not found !");
      } else {
        return await executor.execute(helper);
      }
    }
    const subcommand = helper.interaction.options.getSubcommand();
    if (subcommand) {
      helper.setSubcommandName(subcommand);
      const executor = this.commands.find(
        (executor) => executor.name === subcommand
      );
      if (!executor) {
        return await helper
          .toggleError("No subcommand found for " + subcommand)
          .finish("Subcommand not found !");
      } else {
        return await executor.execute(helper);
      }
    }
    return await helper
      .toggleError("No subcommand found for " + subcommand)
      .finish("Subcommand not found !");
  }
}
