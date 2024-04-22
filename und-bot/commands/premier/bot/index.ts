import * as ping from "./ping";
import * as post from "./post";
import * as update from "./update";

import { onlyAdminMiddleware } from "../../../utils/index";

export const name = "bot";

export const commands = [ping, post, update];

export const middlewares = [onlyAdminMiddleware];
