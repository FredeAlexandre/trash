import readline from "node:readline";

import { refresh } from "@/commands";
import "@/events";
import chalk from "chalk";

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

globalThis.isActionRunning = false;

process.stdin.on("keypress", async (str, key) => {
	if (globalThis.isActionRunning) {
		console.log(
			chalk.cyan("An action is already running. Please wait for it to finish."),
		);
		return;
	}
	if (key.ctrl && key.name === "c") {
		process.exit();
	} else {
		switch (key.name) {
			case "r":
				globalThis.isActionRunning = true;
				await refresh();
				globalThis.isActionRunning = false;
				break;
			default:
				break;
		}
	}
});
