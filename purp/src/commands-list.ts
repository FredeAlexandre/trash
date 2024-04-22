import { database } from "@/commands/database";
import { ping } from "./commands/ping";

export const commands = [ping, database];
