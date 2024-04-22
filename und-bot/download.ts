import axios from "axios";

import { createWriteStream } from "fs";
import { resolve } from "path";

const download = async () => {
  const agents = await axios.get("https://valorant-api.com/v1/agents");

  const data = agents.data.data;

  Promise.all(
    data.map(async (agent: any) => {
      const image = agent.displayIcon;
      const writer = createWriteStream(
        resolve(
          __dirname,
          "agents",
          `${agent.displayName == "KAY/O" ? "KAYO" : agent.displayName}.png`
        )
      );

      const response = await axios.get(image, { responseType: "stream" });

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    })
  );
};

download();
