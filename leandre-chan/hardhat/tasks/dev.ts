import { task, subtask } from "hardhat/config";

import type { EthereumProvider, JsonRpcServer } from "hardhat/types";

import { logHardhatNetworkAccounts } from "../utils/logHardhatNetworkAccounts";

type NodeServerReadyArgs = {
  address: string;
  port: number;
  provider: EthereumProvider;
  server: JsonRpcServer;
}

task("dev", "Create a node network for development and watch files")
  .setAction(async (_, hre) => {
    const node = hre.run("node");

    subtask("node:server-ready", "Wait for the node server to be ready")
      .setAction(async ({address, port}: NodeServerReadyArgs, hre) => {
        console.log(`Started HTTP and WebSocket JSON-RPC server at http://${address}:${port}/`);
        console.log();
        const networkConfig = hre.config.networks["hardhat"];
        logHardhatNetworkAccounts(networkConfig);

        hre.run("watch", { watcherTask: "dev" });
      });

    await node;
  })
