import { subtask, task, types } from "hardhat/config";

task("deploy", "Optionated custom task to deploy the contracts to a network")
  .addOptionalParam(
    "network",
    "The network to deploy the contracts to",
    "localhost",
    types.string,
  )
  .setAction(async ({ network }: { network: string }, { run }) => {
    console.log(`Deploying to network: ${network}`);
    // !TODO Create a little system to make easy to create a deploy task
  });
