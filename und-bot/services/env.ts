import "dotenv/config";

if (!process.env.TOKEN) {
  throw new Error(
    "TOKEN not set add it to .env file or has environment variable"
  );
}

if (!process.env.CLIENT_ID) {
  throw new Error(
    "CLIENT_ID not set add it to .env file or has environment variable"
  );
}

if (!process.env.GUILD_ID) {
  throw new Error(
    "GUILD_ID not set add it to .env file or has environment variable"
  );
}

export const TOKEN = process.env.TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;
export const GUILD_ID = process.env.GUILD_ID;
