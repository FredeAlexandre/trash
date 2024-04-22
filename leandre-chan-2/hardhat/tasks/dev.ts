import { subtask, task, types } from "hardhat/config";
import type { EthereumProvider, JsonRpcServer } from "hardhat/types";

task("dev", "Run the hardhat node and deploy the contracts to it")
  .addOptionalParam(
    "hostname",
    "The host to which to bind to for new connections (Defaults to 127.0.0.1 running locally, and 0.0.0.0 in Docker)",
    undefined,
    types.string,
  )
  .addOptionalParam(
    "port",
    "The port on which to listen for new connections",
    8545,
    types.int,
  )
  .addOptionalParam(
    "fork",
    "The URL of the JSON-RPC server to fork from",
    undefined,
    types.string,
  )
  .addOptionalParam(
    "forkBlockNumber",
    "The block number to fork from",
    undefined,
    types.int,
  )
  .setAction(
    async (
      nodeArgs: {
        forkBlockNumber?: number;
        fork?: string;
        hostname?: string;
        port: number;
      },
      { run },
    ) => {
      subtask("node:server-ready").setAction(
        async ({
          address,
          port,
        }: {
          address: string;
          port: number;
          provider: EthereumProvider;
          server: JsonRpcServer;
        }) => {
          console.log(
            `Started HTTP and WebSocket JSON-RPC server at http://${address}:${port}/`,
          );

          console.log(
            "From custom hook ! here you will be able to publish your code",
          );

          // !TODO Create a hook to deploy task
        },
      );

      await run("node", nodeArgs);
    },
  );
