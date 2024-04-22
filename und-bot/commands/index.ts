import * as hello from "./hello";

import * as valorant from "./valorant";
import * as utils from "./utils";
import * as invite from "./invite";

import * as settings from "./settings";
import * as premier from "./premier";
import {
  CommandProps,
  SubCommandProps,
  GroupSubCommandProps,
  Command,
  SubCommand,
  GroupSubCommand,
} from "../types";

type SubCommandPropsRaw = Omit<SubCommandProps, "commands"> & {
  commands: CommandProps[];
};

type GroupSubCommandPropsRaw = Omit<
  GroupSubCommandProps,
  "subcommands" | "commands"
> & {
  commands: CommandProps[];
  subcommands: SubCommandPropsRaw[];
};

const commands = ([hello] as CommandProps[]).map((x) => new Command(x));

const subcommands = ([valorant, utils, invite] as SubCommandPropsRaw[]).map(
  (x) =>
    new SubCommand({ ...x, commands: x.commands.map((y) => new Command(y)) })
);

const groupsubcommands = ([settings, premier] as GroupSubCommandPropsRaw[]).map(
  (x) =>
    new GroupSubCommand({
      ...x,
      commands: x.commands.map((y) => new Command(y)),
      subcommands: x.subcommands.map(
        (a) =>
          new SubCommand({
            ...a,
            commands: a.commands.map((z) => new Command(z)),
          })
      ),
    })
);

export default [...commands, ...subcommands, ...groupsubcommands];
