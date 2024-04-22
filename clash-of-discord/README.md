# Clash Of Discord

Clash Of Discord is a Discord activity and a bot that inspired by Clash Of Clans.

## Repository Architecture

The repository is a [pnpm monorepo](https://pnpm.io/fr/workspaces) which lets us manage multiple packages in a single repository. The repository is structured as follows:

- `apps`: There is packages that are deployed to production. Like the game, the server, a database, etc...
- `packages`: There is packages that are shared across multiple apps. Like the assets, possible game engine, etc...
- `tooling`: There is packages that are used for development. Like the linter, the formatter, etc...

> Each package have a README.md to be able to quickly understand what it does.
