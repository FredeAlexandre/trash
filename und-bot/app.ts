import "@total-typescript/ts-reset";

import { Routes } from "discord.js";

import redis from "./services/redis";
import discord from "./services/discord";
import rest from "./services/rest";
import logger from "./services/logger";
import { CLIENT_ID, TOKEN } from "./services/env";

import { DiscordInteractionHelper } from "./utils";

import commands from "./commands";
import { resolve } from "path";
import getApplicationCommandsBody from "./utils/discord/getApplicationCommandsBody";

import "./events";
import premier from "./services/premier";

async function initPremier() {
  logger.info("Starting premier bot...");
  await premier.start();
  logger.info("Premier bot started !");
}

async function initRedis() {
  logger.info("Connecting to Redis...");
  await redis.connect();
  logger.info("Redis connected !");
}

async function initDiscord() {
  logger.info("Login to discord...");
  await discord.login(TOKEN);
  logger.info("Discord logged in !");
}

async function initApps(path: string) {
  logger.info("Getting apps...");

  discord.on("interactionCreate", async (interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return;
      logger.debug("The interaction is a command !", interaction.id);
      const result = commands.find(
        (command) => command.name === interaction.commandName
      );
      const helper = new DiscordInteractionHelper(interaction);
      if (result) {
        helper.setCommandName(result.name);
        await result.execute(helper);
        return;
      } else {
        logger.debug("The command is unknown", interaction.id);
        await interaction.reply({
          content: "Command not found !",
          ephemeral: true,
        });
      }
    } catch (error) {
      logger.error("Command execution", error, interaction);
    }
  });

  discord.on("ready", async () => {
    try {
      await initPremier();
    } catch (error) {
      logger.error("initApps@ready", error);
      process.exit(1);
    }
  });

  rest.setToken(TOKEN);
  await rest.put(Routes.applicationCommands(CLIENT_ID), {
    body: getApplicationCommandsBody(commands),
  });
}

async function app() {
  logger.info("UND Bot is starting !");
  await Promise.all([
    initRedis(),
    initDiscord(),
    initApps(resolve(__dirname, "commands")),
  ]);
  logger.info("UND Bot is ready !");
}

try {
  app();
} catch (error) {
  logger.error("init", error);
  process.exit(1);
}
